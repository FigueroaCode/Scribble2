import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { FirebaseService } from '../../providers/firebase-service';
import { FirebaseListObservable } from 'angularfire2/database';

import { HomePage } from '../home/home';


@Component({
  selector: 'page-pendingrequest',
  templateUrl: 'pendingrequest.html'
})
export class PendingRequestPage {

    requests: FirebaseListObservable<any[]>;
    courseKey: string;

      constructor(public navCtrl: NavController, public authService: AuthService, public firebaseService: FirebaseService,
          public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

            this.courseKey = navParams.get('key');

            this.initializeRequest();
      }

      initializeRequest(){
          this.requests = this.firebaseService.getPendingRequest(this.courseKey);
      }

      acceptRequest(username: string, id: string){
        //add them to the course members
        this.firebaseService.joinCourse(this.courseKey, username);
        //remove them from the list
        this.firebaseService.removePendingRequest(id, this.courseKey);
      }

      denyRequest(id: string){
        //remove them from the list
        this.firebaseService.removePendingRequest(id, this.courseKey);
      }
}
