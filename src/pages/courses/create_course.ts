import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from '../../providers/firebase-service';
import { AuthService } from '../../providers/auth-service';

import { Course } from '../../models/course';

@Component({
  selector: 'page-create_course',
  templateUrl: 'create_course.html'
})

export class CreateCoursePage{

    createCourse: any;
    displayName: string;

    constructor(public navParams: NavParams,public viewCtrl: ViewController,
        public formBuilder: FormBuilder, public firebaseService: FirebaseService, public authService: AuthService){
        this.createCourse = formBuilder.group({
            courseTitle: ['', Validators.required],
            description: ['', Validators.required],
            courseID: ['', Validators.required],
            professor: ['', Validators.required],
            university: ['', Validators.required]
        });

        //check that user exists
        if(this.authService.getFireAuth().currentUser)
            this.displayName = this.authService.getFireAuth().currentUser.displayName;
    }

    createACourse(){
        //Make sure all the fields are not empty
        if(this.displayName != null && this.createCourse.value.courseTitle != '' && this.createCourse.value.description != '' && this.createCourse.value.courseID != ''
            && this.createCourse.value.professor != '' && this.createCourse.value.university != ''){
                let newCourse = new Course(this.displayName,this.createCourse.value.courseTitle.toLowerCase(), this.createCourse.value.courseTitle, ' ',
                    this.createCourse.value.description, this.createCourse.value.professor, this.createCourse.value.university,
                    this.createCourse.value.courseID,1,0);
            //get the users id
            let that = this;
            this.firebaseService.getCurrentUserID(this.displayName).then(function(key){
                that.firebaseService.addCourse(newCourse, key);
            });
            //send the new course back to the courses page
            let courseData = {'course': newCourse};
            this.viewCtrl.dismiss(courseData);
        }else{
            console.log("A Field is Empty");
        }
    }

    //close modal
    cancel(){
        this.viewCtrl.dismiss();
    }
}
