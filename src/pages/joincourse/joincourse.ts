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
    courses: Array<any>;
    filterType: string;
    filterText: string;
    displayName: string;

    constructor(public navCtrl: NavController, public firebaseService: FirebaseService,
        public authService: AuthService, public alertCtrl: AlertController) {
        this.filterType = "";
        this.filterText = "";

        //check that user exists
        if(this.authService.getFireAuth().currentUser)
            this.displayName = this.authService.getFireAuth().currentUser.displayName;

        this.initializeList();
    }

    initializeList(){
      if(this.displayName !=  undefined){
        let that = this;
        this.firebaseService.getFirebaseAsArray(this.displayName).then(function(excludedCourses){
          that.courses = excludedCourses as any[];
        });
      }
    }

    //Filter Items for course list.
    chooseFilter(target: string) {
      this.filterType = target;
    }

    applyFilters(target: string){
      this.filterText = target;
      //A filter type must be selected in order to filter the course list.
      if(this.filterType != ''){

      }else{

      }
    }

    //Joining a course
    joinCourse(courseKey, courseOwner){
        //its going to send a request instead later
        this.firebaseService.sendJoinRequest(courseKey, this.displayName, courseOwner);
    }
}
