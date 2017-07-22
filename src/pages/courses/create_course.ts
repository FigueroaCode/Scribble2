import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../providers/firebase-service';

import { Course } from '../../models/course';

@Component({
  selector: 'page-create_course',
  templateUrl: 'create_course.html'
})

export class CreateCoursePage{

    createCourse: any;
    displayName: string;

    constructor(public navParams: NavParams,public viewCtrl: ViewController, public formBuilder: FormBuilder, public firebaseService: FirebaseService){
        this.createCourse = formBuilder.group({
            courseTitle: ['', Validators.required],
            description: ['', Validators.required],
            courseID: ['', Validators.required],
            professor: ['', Validators.required],
            university: ['', Validators.required]
        });

        this.displayName = navParams.get('name');
    }

    createACourse(){
        //Make sure all the fields are not empty
        if(this.displayName != '' && this.createCourse.value.courseTitle != null && this.createCourse.value.description != null && this.createCourse.value.courseID != null
            && this.createCourse.value.professor != null && this.createCourse.value.university != null){
                let newCourse = new Course(this.displayName, this.createCourse.value.courseTitle,
                    this.createCourse.value.description, this.createCourse.value.professor, this.createCourse.value.university,
                    this.createCourse.value.courseID);
            this.firebaseService.addCourse(newCourse);
            this.viewCtrl.dismiss();
        }else{
            console.log("A Field is Empty");
        }
    }

    //close modal
    cancel(){
        this.viewCtrl.dismiss();
    }
}
