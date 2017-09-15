import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';
import { File } from '@ionic-native/file';

import { Chapter } from '../../models/chapter';
import { MergeHandler } from '../../models/mergeHandler';


@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html'
})

export class NotesPage {
    @ViewChild("fileInput") fileInput;
    chapters: FirebaseListObservable<any[]>;
    displayName: string;
    publicText: string;
    privateText: string;
    courseKey: string;
    currentChapterKey: string;
    inPublicNote: boolean;
    //Set defualt Segment to the main Note
    noteSegment: string = "publicNote";
    getFirstChapterKey: Promise<any>;
    getFirebase: Promise<any>;
    dropDownTitle: string;
    chosenFileName: string;

    constructor(public navCtrl: NavController, public firebaseService: FirebaseService,
    public authService: AuthService, public alertCtrl: AlertController, public toastCtrl: ToastController,
    public modalCtrl: ModalController, public navParams: NavParams, private file: File) {
        //need to wrap this in a promise in order to use it in another promise
        let getCourseKey = new Promise(function(resolve, reject){
            let key = navParams.get('key');
            resolve(key);
        });
        this.getFirebase = new Promise(function(resolve, reject){
             resolve(firebaseService);
        });
        //Get the key of the course this belongs to
        this.courseKey = navParams.get('key');
        this.currentChapterKey = '';
        this.inPublicNote = true;
        //check that user exists
        if(this.authService.getFireAuth().currentUser)
            this.displayName = this.authService.getFireAuth().currentUser.displayName;

        this.initializeChapters();
        //set the first chapter as the default
        this.getFirstChapterKey =  new Promise(function(resolve, reject){
            getCourseKey.then(function(courseKey){
                firebaseService.getDB().database.ref('/courseChapters/'+courseKey).once('value').then(function(snapshot){
                         snapshot.forEach(function(childsnapshot){
                             resolve(childsnapshot.key);
                            }
                        );
                    });
            });
        });
        //Set the textbox to the text of the first chapter
        let that = this;
        this.getFirstChapterKey.then(function(chapterKey){
            firebaseService.getDB().database.ref('/courseChapters/' + that.courseKey + '/' + chapterKey).once('value').then(function(getChapterName){
              that.dropDownTitle = getChapterName.val().chapterName;
            });
            firebaseService.getNoteText(that.displayName,that.courseKey, chapterKey, true)
            .then(function(noteText){
                that.setPublicNoteText(noteText);
            });
            firebaseService.getNoteText(that.displayName,that.courseKey, chapterKey, false)
            .then(function(noteText){
                that.setPrivateNoteText(noteText);
            });
        });

        this.dropDownTitle = "No Chapters Exist";
        this.chosenFileName = "IMPORT TEXT FILE";

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

    createChapter(){
      let alert = this.alertCtrl.create({
        title: 'Name your Chapter',
        inputs: [
          {
            name: 'chapterNameInput',
            placeholder: 'New Chapter Name'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              //Cancel
            }
          },
          {
            text: 'Create',
            handler: data => {
              if(this.displayName !=null && data.chapterNameInput != ''){
                let dateCreated = new Date().toString();
                let newChapter= new Chapter(data.chapterNameInput,"",dateCreated);
                this.firebaseService.addChapter(newChapter, this.courseKey, {owner: this.displayName, privateNoteText: "", dateUpdated: dateCreated});
              }else{
                //let the user know later that it wasnt created because they didnt put a field
                let toast = this.toastCtrl.create({
                  message: 'You failed to create a chapter.',
                  duration: 5000
                });

                toast.present();
              }
            }
          }
        ]
      });

      alert.present();
    }
    updateNoteText(){
        let that = this;
        if((this.currentChapterKey == null || this.currentChapterKey == '') && this.courseKey != null && this.privateText != null){
            //needs to be done in order for the promise to recognize which object 'this' is referring
            this.getFirstChapterKey.then(function(firstKey){
                //default chapter is the first one
                that.firebaseService.getNoteText(that.displayName,that.courseKey,firstKey, that.inPublicNote)
                .then(function(noteText){
                  if(that.inPublicNote)
                    that.setPublicNoteText(noteText);
                  else
                    that.setPrivateNoteText(noteText);
                });
            });
        }else if(this.courseKey != null && this.privateText != null && this.currentChapterKey != ''){
            this.firebaseService.getNoteText(this.displayName,this.courseKey,this.currentChapterKey, this.inPublicNote)
            .then(function(noteText){
              if(that.inPublicNote)
                that.setPublicNoteText(noteText);
              else
                that.setPrivateNoteText(noteText);
            });
        }
    }

    showNote(chapterKey, chapterName){
        this.currentChapterKey = chapterKey;
        this.updateNoteText();
        this.dropDownTitle = chapterName;
    }

    saveNote(){
        if((this.currentChapterKey == null || this.currentChapterKey == '') && this.courseKey != null && (this.privateText != null || this.privateText != '')){
            //needs to be done in order for the promise to recognize which object 'this' is referring to
            let that = this;
            this.getFirstChapterKey.then(function(firstKey){
                //defualt chapter is the first one
                that.firebaseService.saveNotes(that.displayName,that.courseKey,firstKey, that.privateText, that.inPublicNote);
            });
        }else if(this.courseKey != null && (this.privateText != null || this.privateText != '') && this.currentChapterKey != ''){
            this.firebaseService.saveNotes(this.displayName,this.courseKey,this.currentChapterKey, this.privateText, this.inPublicNote);
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

    toggleDropDown() {
      document.getElementById("chapterDropdown").classList.toggle("show");
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

      let mergeHandler = new MergeHandler(this.privateText, this.publicText);

      if((this.currentChapterKey == null || this.currentChapterKey == '') && this.courseKey != null && (this.privateText != null || this.privateText != '')){
          //needs to be done in order for the promise to recognize which object 'this' is referring to
          let that = this;
          this.getFirstChapterKey.then(function(firstKey){
              //default chapter is the first one
              that.firebaseService.saveNotes(that.displayName, that.courseKey,firstKey, that.privateText, true);
              that.firebaseService.saveNotes(that.displayName, that.courseKey,firstKey, that.privateText, false);
          });
      }else if(this.courseKey != null && (this.privateText != null || this.privateText != '') && this.currentChapterKey != ''){
          this.firebaseService.saveNotes(this.displayName,this.courseKey,this.currentChapterKey, this.privateText, true);
          this.firebaseService.saveNotes(this.displayName,this.courseKey,this.currentChapterKey, this.privateText, false);
      }
    }

}
