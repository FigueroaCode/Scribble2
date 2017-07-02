import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../providers/firebase-service';
import { FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';

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
    public authService: AuthService, public alertCtrl: AlertController, public formBuilder: FormBuilder) {
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
        let prompt = this.alertCtrl.create({
            title: 'Create Course',
            message: 'Enter the title and a description of your course.',
            inputs: [
                {
                    name: 'title',
                    placeholder: 'Course Title'
                },
                {
                    name: 'description',
                    placeholder: 'Course Description'
                },
                {
                    name: 'courseId',
                    placeholder: 'Course ID, ex: MAC2312'
                },
                {
                    name: 'professor',
                    placeholder: 'Professor of the Course'
                },
                {
                    name: 'university',
                    placeholder: 'The University the course is from'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Create',
                    handler: data => {
                        //Make sure all the fields are not empty
                        if(this.displayName != '' && data.title != '' && data.description != '' && data.courseId != ''
                            && data.professor != '' && data.university != ''){
                            this.firebaseService.addCourse({
                                owner: this.displayName,
                                title: data.title,
                                content: data.description,
                                courseID: data.courseId,
                                professor: data.professor,
                                university: data.university
                            })
                        }else{
                            console.log("A Field is Empty");
                        }
                    }
                }
            ]
        });

        prompt.present();
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
