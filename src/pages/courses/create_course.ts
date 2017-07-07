import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../providers/firebase-service';

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
        // console.log(this.displayName);
        // console.log(this.createCourse.value.courseTitle);
        // console.log(this.createCourse.courseTitle);
        // console.log(this.createCourse.description);
        // console.log(this.createCourse.courseID);
        // console.log(this.createCourse.professor);
        // console.log(this.createCourse.university);
        if(this.displayName != '' && this.createCourse.value.courseTitle != null && this.createCourse.value.description != null && this.createCourse.value.courseID != null
            && this.createCourse.value.professor != null && this.createCourse.value.university != null){
            this.firebaseService.addCourse({
                owner: this.displayName,
                title: this.createCourse.value.courseTitle,
                content: this.createCourse.value.description,
                courseID: this.createCourse.value.courseID,
                professor: this.createCourse.value.professor,
                university: this.createCourse.value.university
            })
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
