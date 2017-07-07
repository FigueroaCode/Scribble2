import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';
import { ModalController } from 'ionic-angular';
import { CreateCoursePage } from './create_course';

import { HomePage } from '../home/home';
import { JoinCoursePage } from '../joincourse/joincourse';
import { NotesPage } from '../notes/notes';

@Component({
  selector: 'page-courses',
  templateUrl: 'courses.html'
})

export class CoursesPage {

    courses: FirebaseListObservable<any[]>;
    displayName: string;

    constructor(public navCtrl: NavController, public firebaseService: FirebaseService,
    public authService: AuthService, public alertCtrl: AlertController, public modalCtrl: ModalController) {
        //check that user exists
        if(this.authService.getFireAuth().currentUser)
            this.displayName = this.authService.getFireAuth().currentUser.displayName;
        //Initialize Courses
        this.initializeCourses();
    }

    initializeCourses(){

        this.courses = this.firebaseService.getDB().list('/courses', {
            query:
            {
                orderByChild: 'owner',
                equalTo: this.displayName
            }
        });
    }

    createCourse(){
        let info = {name: this.displayName};
        let modal = this.modalCtrl.create(CreateCoursePage, info);
        modal.present();
    }

    joinCourse(){
        this.navCtrl.push(JoinCoursePage);
    }

    deleteCourse(id){
        let prompt = this.alertCtrl.create({
            title: "Delete a Course",
            message: "Do you want to delete this course?",
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Delete',
                    handler: data => {
                        this.firebaseService.removeCourse(id);
                    }
                }
            ]
        });

        prompt.present();
    }

    //Filter Items for Search Bar
    getItems(ev: any) {
      this.initializeCourses();
      // set val to the value of the searchbar
      let val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
          this.courses = this.firebaseService.getDB().list('/courses', {
              query:
              {
                  orderByChild: 'title',
                  equalTo: val

              }
          });
      }
  }

  //go to note page
  notes(){
    this.navCtrl.push(NotesPage);
  }
}
