import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { FirebaseService } from '../../providers/firebase-service';
import { FirebaseListObservable } from 'angularfire2/database';

import { HomePage } from '../home/home';


@Component({
  selector: 'page-savedcourses',
  templateUrl: 'savedcourses.html'
})
export class SavedCoursesPage {

    courses: FirebaseListObservable<any[]>;
    courseKey: string;
    displayName: string;

      constructor(public navCtrl: NavController, public authService: AuthService, public firebaseService: FirebaseService,
          public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

            if(this.authService.getFireAuth().currentUser)
                this.displayName = this.authService.getFireAuth().currentUser.displayName;

            this.initializeCourses();
      }

      initializeCourses(){
          this.courses = this.firebaseService.getFavoriteCourses();
      }

      //Joining a course
      joinCourse(courseKey, courseOwner){
          //its going to send a request instead later
          this.firebaseService.sendJoinRequest(courseKey, this.displayName, courseOwner);
      }

}
