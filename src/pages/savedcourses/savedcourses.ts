import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { FirebaseService } from '../../providers/firebase-service';
import { FirebaseListObservable } from 'angularfire2/database';

import { HomePage } from '../home/home';
import { CheckNotesPage } from '../checknotes/checknotes';


@Component({
  selector: 'page-savedcourses',
  templateUrl: 'savedcourses.html'
})
export class SavedCoursesPage {

    courses: FirebaseListObservable<any[]>;
    courseKey: string;
    displayName: string;

      constructor(public navCtrl: NavController, public authService: AuthService, public firebaseService: FirebaseService,
          public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {

            if(this.authService.getFireAuth().currentUser)
                this.displayName = this.authService.getFireAuth().currentUser.displayName;

            this.initializeCourses();
      }

      initializeCourses(){
          this.courses = this.firebaseService.getFavoriteCourses(this.displayName);
      }

      //Joining a course
      joinCourse(id,courseKey, courseOwner){
          //its going to send a request instead later
          this.firebaseService.sendJoinRequest(courseKey, this.displayName, courseOwner);
          //remove from favorite list
           this.firebaseService.removeFromFavorite(id);

           let toast = this.toastCtrl.create({
             message: "Request Sent",
             duration: 3000
           });

           toast.present();
      }

      checkNotes(courseKey){
        let data = {'key': courseKey};
        this.navCtrl.push(CheckNotesPage, data);
      }

}
