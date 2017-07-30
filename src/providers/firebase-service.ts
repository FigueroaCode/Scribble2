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
    //create chapter container
    this.fireDB.list('/courses/').update(key, {'chapters': ''});
    //set the first member to be the owner
    this.fireDB.database.ref('/courses/'+key).child('members').set({'owner': course.getOwner()});
  }

  addChapter(chapter: Chapter, courseKey: string){
     let key = this.fireDB.list('/courses/'+ courseKey+'/chapters/').push(chapter).key;
     this.fireDB.list('/courses/'+ courseKey+'/chapters/').update(key,{'key': key});
  }

  sendJoinRequest(courseKey: string, username: string){
      let that = this;
      this.fireDB.database.ref('/courses/'+courseKey).once('value').then(function(snapshot){
          let currentCount = snapshot.val().requestCounter;
          let ownerName = snapshot.val().owner;
          //check to see if person already exists and they arent the owner
          if(ownerName != username){
              that.fireDB.database.ref('/courses/'+courseKey+'/pendingRequest/').once('value').then(function(snapshot2){
                  let exist = false;

                  snapshot2.forEach(function(child){
                      if(child.val().name == username){
                          exist = true;
                      }
                  });

                  if(!exist){
                      //increase request count
                      currentCount++;
                      that.fireDB.database.ref('/courses/'+courseKey+'/requestCounter/').set(currentCount);

                      that.fireDB.list('/courses/'+courseKey+'/pendingRequest/').push({'name': username});
                  }
              });
          }

      });
  }

  joinCourse(courseID: string, username: string){
      let that = this;
      //check that they arent already in the course, check that they arent the owner
      this.fireDB.database.ref('/courses/'+courseID+'/members/').once('value').then(function(snapshot){
          let exists = false;
          //go through each member
          snapshot.forEach(function(child){
              let name = child.val().name;

              if(name == username){
                  //found the user
                  exists = true;
              }
          });

          if(!exists){
              that.fireDB.list('/courses/'+courseID+'/members/').push({'name': username});
          }

      });
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
