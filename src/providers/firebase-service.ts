import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';

import { Course } from '../models/course';
import { Chapter } from '../models/chapter';
import { Note } from '../models/note';

@Injectable()
export class FirebaseService {

  constructor(public fireDB: AngularFireDatabase) {

  }

  getDB(){
    return this.fireDB;
    }

  getCourses(){
    return this.fireDB.list('/courses/');
  }

  getChapters(courseKey: string){
      return this.fireDB.list('/courses/'+courseKey+'/chapters/');
  }

  addCourse(course: Course){
      //add a course object to the database

    let key = this.fireDB.list('/courses/').push(course).key;
    this.fireDB.list('/courses/').update(key, {'key': key});
    this.fireDB.list('/courses/').update(key, {'chapters': ''});
  }

  addChapter(chapter: Chapter, courseKey: string){
     let key = this.fireDB.list('courses/'+ courseKey+'/chapters/').push(chapter).key;
     this.fireDB.list('courses/'+ courseKey+'/chapters/').update(key,{'key': key});
  }

  saveNotes(courseKey: string,chapterKey: string,text: string,isPublic: boolean){
    if(isPublic){
        this.fireDB.database.ref().child('/courses/'+courseKey+'/chapters/'+chapterKey+'/publicNote/').child('text').set(text);
    }else{
        this.fireDB.database.ref().child('/courses/'+courseKey+'/chapters/'+chapterKey+'/privateNote/').child('text').set(text);
    }
  }

  getNoteText(courseKey: string,chapterKey: string,isPublic: boolean): Promise<any>{
      let that = this;
      let textPromise = new Promise(function(resolve, reject){
          if(isPublic){
              that.fireDB.database.ref('/courses/'+courseKey+'/chapters/'+chapterKey+'/publicNote/').once('value')
              .then(function(snapshot){
                  resolve(snapshot.val().text);
              });
          }else{
              that.fireDB.database.ref('/courses/'+courseKey+'/chapters/'+chapterKey+'/privateNote/').once('value')
              .then(function(snapshot){
                  resolve(snapshot.val().text);
              });
          }
      });
      return textPromise;
  }

  removeCourse(id){
    this.fireDB.list('/courses/').remove(id);
  }

  removeChapter(id, courseKey: string){
    this.fireDB.list('/courses/'+courseKey+'/chapters/').remove(id);
  }
}
