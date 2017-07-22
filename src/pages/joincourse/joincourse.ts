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
    coursesToShow: FirebaseListObservable<any[]>;
    appliedFilters: {
      title: string,
      courseID: string,
      professor: string,
      university: string
    };

    constructor(public navCtrl: NavController, public firebaseService: FirebaseService,
        public authService: AuthService, public alertCtrl: AlertController) {
        this.initializeList();
        this.appliedFilters = {
          title: '',
          courseID: '',
          professor: '',
          university: ''
        };
    }

    initializeList(){
        this.courses = this.firebaseService.getCourses();
        console.log(this.courses);
    }

    //Filter Items for course list.
    filterItems(target: string, type: string) {

      // if the value is an empty string don't filter the items
      if (target != null && target.trim() != '' && type == 'courseNameInput') {
          this.appliedFilters.title = target;
      }else if (target != null && target.trim() != '' && type == 'courseID') {
          this.appliedFilters.courseID = target;
      }else if (target != null && target.trim() != '' && type == 'professor') {
          this.appliedFilters.professor = target;
      } else if (target != null && target.trim() != '' && type == 'university') {
          this.appliedFilters.university = target;
      }

      this.applyFilters();
    }

    applyFilters(){
      let tempCourses = this.firebaseService.getDB().list('/courses');
      tempCourses.forEach(list => {
        for(let x = 0; x < list.length; x++){
          if(
            ( (list[x].title != this.appliedFilters.title) || (this.appliedFilters.title != '') ) &&
            ( (list[x].courseID != this.appliedFilters.courseID) || (this.appliedFilters.courseID != '') ) &&
            ( (list[x].professor != this.appliedFilters.professor) || (this.appliedFilters.professor != '') ) &&
            ( (list[x].university != this.appliedFilters.university) || (this.appliedFilters.university != '') )
          ){
            //This is in case I ever need to find courses that do not match the filter.
          }else{
            //This is where you handle courses that do match the filter.
            console.log(list[x])
            this.coursesToShow.push(list[x]);
          }
        }
      });
      this.courses = this.coursesToShow;
    }

}
