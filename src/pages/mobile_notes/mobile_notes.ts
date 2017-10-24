import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController, ToastController, Slides } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';
import { File } from '@ionic-native/file';

import { Chapter } from '../../models/chapter';
import { MergeHandler } from '../../models/mergeHandler';


@Component({
  selector: 'page-mobile_notes',
  templateUrl: 'mobile_notes.html'
})

export class MobileNotesPage {
    @ViewChild("fileInput") fileInput;
    @ViewChild(Slides) slides: Slides;
    chapters: FirebaseListObservable<any[]>;
    changeLog: FirebaseListObservable<any[]>;
    displayName: string;
    publicText: string;
    privateText: string;
    courseKey: string;
    inPublicNote: boolean;
    //Set defualt Segment to the main Note
    noteSegment: string = "privateNote";
    getFirstChapterKey: Promise<any>;
    getFirebase: Promise<any>;
    chosenFileName: string;
    isApp: boolean;
    chapterName: string;
    chapterKey: string;

    constructor(public navCtrl: NavController, public firebaseService: FirebaseService,
    public authService: AuthService, public alertCtrl: AlertController, public toastCtrl: ToastController,
    public modalCtrl: ModalController, public navParams: NavParams, private file: File) {
        this.isApp = !document.URL.startsWith('http');
        this.inPublicNote = false;
        this.chapterName = navParams.get('chapterName');
        this.chapterKey = navParams.get('chapterKey');

        this.getFirebase = new Promise(function(resolve, reject){
             resolve(firebaseService);
        });
        //Get the key of the course this belongs to
        this.courseKey = navParams.get('courseKey');
        //check that user exists
        if(this.authService.getFireAuth().currentUser)
            this.displayName = this.authService.getFireAuth().currentUser.displayName;
        //Set the textbox to the text of the first chapter
        let that = this;
        firebaseService.getNoteText(that.displayName,this.courseKey, this.chapterKey, false)
        .then(function(noteText){
            that.setPrivateNoteText(noteText);
        });
        this.chosenFileName = "IMPORT TEXT FILE";

        this.initializeChangeLog();
    }

    initializeChangeLog(){
      if(this.courseKey != null && this.chapterKey != ''){
        this.changeLog = this.firebaseService.getChangeLog(this.chapterKey);
      }
    }

    initializeChapters(){
        this.chapters = this.firebaseService.getChapters(this.courseKey);
    }

    setPublicNoteText(newText: string){
        this.publicText = newText;
    }

    setPrivateNoteText(newText: string){
        this.privateText = newText;
    }

    updateNoteText(){
        let that = this;
        console.log('stop');
        if(this.courseKey != null && this.privateText != null && this.chapterKey != ''){
            this.firebaseService.getNoteText(this.displayName,this.courseKey,this.chapterKey, this.inPublicNote)
            .then(function(noteText){
              if(that.inPublicNote){
                console.log(noteText);
                that.setPublicNoteText(noteText);
              }else{
                that.setPrivateNoteText(noteText);
              }
            });
        }
    }


    saveNote(){
        if((this.chapterKey == null || this.chapterKey == '') && this.courseKey != null && (this.privateText != null || this.privateText != '')){
            //needs to be done in order for the promise to recognize which object 'this' is referring to
            let that = this;
            this.getFirstChapterKey.then(function(firstKey){
                //default chapter is the first one
                that.firebaseService.saveNotes(that.displayName,that.courseKey,firstKey, that.privateText, that.inPublicNote);
            });
        }else if(this.courseKey != null && (this.privateText != null || this.privateText != '') && this.chapterKey != ''){
            this.firebaseService.saveNotes(this.displayName,this.courseKey,this.chapterKey, this.privateText, this.inPublicNote);
        }
    }

    //Switching Between Notes
    publicNoteClicked(){
        this.inPublicNote = true;
        this.updateNoteText();
    }

    privateNoteClicked(){
        this.inPublicNote = false;
        this.updateNoteText();
    }

    filterFileName(fileURL: string){
      let fileName = "";
      let initialPoint = 0;
      for( let i = 0; i < fileURL.length; i++){
        if(fileURL[i] == '/' || fileURL[i] == '\\'){
          initialPoint = i+1;
        }
      }
      fileName = fileURL.substring(initialPoint);
      return fileName;
    }

    readSingleFile() {
      let that = this;
      var file = this.fileInput.nativeElement.files[0];
      this.chosenFileName = this.filterFileName(this.fileInput.nativeElement.value);
      if (!file) {
        return;
      }
      var reader = new FileReader();
      reader.onload = function(e) {
        let contents = e.target as FileReader;
        that.privateText = contents.result;
      };
      reader.readAsText(file);
    }

    prepareMerge(){
      let that = this;
      if((this.chapterKey == null || this.chapterKey == '') && this.courseKey != null && (this.privateText != null && this.privateText != '')){
          //needs to be done in order for the promise to recognize which object 'this' is referring to
          this.getFirstChapterKey.then(function(firstKey){
              //default chapter is the first one
              that.firebaseService.saveNotes(that.displayName, that.courseKey,firstKey, that.privateText, false);
              if(that.publicText == null || that.publicText == ''){
                that.firebaseService.saveNotes(that.displayName,that.courseKey,firstKey, that.privateText, true);
              }else{
                let mergeHandler = new MergeHandler(that.privateText, that.publicText,firstKey, that.firebaseService);
              }
          });
      }else if(this.courseKey != null && (this.privateText != null && this.privateText != '') && this.chapterKey != ''){
          this.firebaseService.saveNotes(this.displayName,this.courseKey,this.chapterKey, this.privateText, false);
          if(this.publicText == null || this.publicText == ''){
            this.firebaseService.saveNotes(this.displayName,this.courseKey,this.chapterKey, this.privateText, true);
          }else{
            let mergeHandler = new MergeHandler(that.privateText, that.publicText,that.chapterKey, this.firebaseService);
          }

      }
    }

    nextSlide(){
      this.slides.slideNext(500,false);
    }

    previousSlide(){
      this.slides.slidePrev(500,false);
    }

}
