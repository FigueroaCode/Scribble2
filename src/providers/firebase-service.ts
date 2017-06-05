import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';

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

  addCourse(course){
    //course is an object with an owner, title and content
    this.fireDB.list('/courses/').push(course);
  }

  removeCourse(id){
    this.fireDB.list('/courses/').remove(id);
  }
}
