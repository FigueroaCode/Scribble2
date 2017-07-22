import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';

import { Course } from '../models/course';

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

  addCourse(course: Course){
      //add a course object to the database
    this.fireDB.list('/courses/').push(course);
  }

  saveNotes(note){
      //TODO: Make a Note Class
      //If it already exists update it
     let key = this.fireDB.list('/notes/').push(note).key;
  }

  removeCourse(id){
    this.fireDB.list('/courses/').remove(id);
  }
}
