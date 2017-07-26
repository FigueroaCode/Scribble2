import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../providers/firebase-service';
import { AuthService } from '../../providers/auth-service';

import { Course } from '../../models/course';
import { Chapter } from '../../models/chapter';
import { Note } from '../../models/note';

@Component({
  selector: 'page-create_chapter',
  templateUrl: 'create_chapter.html'
})

export class CreateChapterPage{

    createChapter: any;
    displayName: string;
    courseKey: string;

    constructor(public navParams: NavParams,public viewCtrl: ViewController,
        public formBuilder: FormBuilder, public firebaseService: FirebaseService, public authService: AuthService){
        this.createChapter = formBuilder.group({
            chapterName: ['', Validators.required],
        });

        //check that user exists
        if(this.authService.getFireAuth().currentUser)
            this.displayName = this.authService.getFireAuth().currentUser.displayName;

        this.courseKey = this.navParams.get('key');
    }

    createAChapter(){
        //Make sure all the fields are not empty

        if(this.displayName != null && this.createChapter.value.chapterName != null && this.createChapter.value.chapterName != '' ){
                let newChapter= new Chapter(this.createChapter.value.chapterName, '',
                     new Note(this.displayName, '',new Date().toString(),false),
                     new Note(this.displayName, '',new Date().toString(),true));
            this.firebaseService.addChapter(newChapter, this.courseKey);
            //send the new course back to the courses page
            let chapterData = {'chapter': newChapter};
            this.viewCtrl.dismiss(chapterData);
        }else{
            console.log("A Field is Empty");
        }
    }

    //close modal
    cancel(){
        this.viewCtrl.dismiss();
    }
}
