import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
//import { FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';
import { CheckNotesPage } from '../checknotes/checknotes';

@Component({
  selector: 'page-joincourse',
  templateUrl: 'joincourse.html'
})

export class JoinCoursePage {
    courses: Array<any>;
    unfilteredCourses: Array<any>;
    displayName: string;

    courseTitle: string = "";
    courseID: string = "";
    professor: string = "";
    university: string = "";


    constructor(public navCtrl: NavController, public firebaseService: FirebaseService,
        public authService: AuthService, public alertCtrl: AlertController, public toastCtrl: ToastController) {
        //check that user exists
        if(this.authService.getFireAuth().currentUser)
            this.displayName = this.authService.getFireAuth().currentUser.displayName;

        this.initializeList();
    }

    initializeList(){
      if(this.displayName !=  undefined){
        let that = this;
        this.firebaseService.getFirebaseAsArray(this.displayName).then(function(excludedCourses){
          that.unfilteredCourses = excludedCourses as any[];
          that.courses = that.unfilteredCourses;
        });
      }
    }

    // ---- Filter Handling ---- //
    updateFilter(){
      let that = this;
      //if all the filters are empty show all the courses
      if(this.courseTitle.trim() == "" && this.courseID.trim() == ""
        && this.professor.trim() == "" && this.university.trim() == ""){
          this.initializeList();
      }else{
        //filter courses according to criteria
        this.courses = this.unfilteredCourses.filter(function(course){
          //add up all the filters into one string
          let compositeFilter = that.courseTitle.trim() + that.courseID.trim() + that.professor.trim() + that.university.trim();
          let courseComposite = "";
          //Add up the courses properties in the same order, ignoring that filters that were empty
          if(that.courseTitle.trim() != "")
            courseComposite += course.title;
          if(that.courseID.trim() != "")
            courseComposite += course.courseID;
          if(that.professor.trim() != "")
            courseComposite += course.professor;
          if(that.university.trim() != "")
            courseComposite += course.university;
          //check if the strings match
          if(courseComposite == compositeFilter)
            return true;
          else
            return false;
        });
      }
    }

    clearFilters(){
      this.courseTitle = "";
      this.courseID = "";
      this.professor = "";
      this.university = "";

      this.initializeList();
    }
    // ---- End of Filter Handling ---- //

    //Joining a course
    joinCourse(courseKey, courseOwner){
        //its going to send a request instead later
        this.firebaseService.sendJoinRequest(courseKey, this.displayName, courseOwner);

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

    saveCourse(course){
      this.firebaseService.favoriteCourse(course,this.displayName);

      let toast = this.toastCtrl.create({
        message: "Course Saved",
        duration: 3000
      });

      toast.present();
    }
}
