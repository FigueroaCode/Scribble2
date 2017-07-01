import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-joincourse',
  templateUrl: 'joincourse.html'
})

export class JoinCoursePage {

    courses: FirebaseListObservable<any[]>;
    name: string;

    constructor(public navCtrl: NavController, public firebaseService: FirebaseService,
        public authService: AuthService, public alertCtrl: AlertController) {
        this.initializeList();
        this.name = "Lalalaa";
    }

    initializeList(){
        this.courses = this.firebaseService.getCourses();
    }

    //Filter Items for course list.
    filterItems(target: string, type: string) {
      // if the value is an empty string don't filter the items
      if (target && target.trim() != '' && type == 'courseNameInput') {
          this.courses = this.firebaseService.getDB().list('/courses', {
              query:
              {
                  orderByChild: 'title',
                  equalTo: target
              }
          });
      }else if (target && target.trim() != '' && type == 'courseID') {
          this.courses = this.firebaseService.getDB().list('/courses', {
              query:
              {
                  orderByChild: 'courseID',
                  equalTo: target
              }
          });
      }else if (target && target.trim() != '' && type == 'professor') {
          this.courses = this.firebaseService.getDB().list('/courses', {
              query:
              {
                  orderByChild: 'professor',
                  equalTo: target
              }
          });
      } else if (target && target.trim() != '' && type == 'university') {
          this.courses = this.firebaseService.getDB().list('/courses', {
              query:
              {
                  orderByChild: 'university',
                  equalTo: target
              }
          });
      }
  }
}
