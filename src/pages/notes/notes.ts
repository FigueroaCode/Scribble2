import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';
import { File } from '@ionic-native/file';


import { CreateChapterPage } from './create_chapter';
import { PrivateNote } from '../../models/private_note';
import { PublicNote } from '../../models/public_note';
import { Chapter } from '../../models/chapter';


@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html'
})

export class NotesPage {
    chapters: FirebaseListObservable<any[]>;
    displayName: string;
    text: string;
    courseKey: string;
    currentChapterKey: string;
    inPublicNote: boolean;
    //Set defualt Segment to the main Note
    noteSegment: string = "publicNote";
    getFirstChapterKey: Promise<any>;
    getFirebase: Promise<any>;
    dropDownTitle: string;


    constructor(public navCtrl: NavController, public firebaseService: FirebaseService,
    public authService: AuthService, public alertCtrl: AlertController,
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
              that.dropDownTitle = getChapterName.val().name;
            });
            firebaseService.getNoteText(that.courseKey, chapterKey, that.inPublicNote)
            .then(function(noteText){
                that.setNoteText(noteText);
            });
        });

    }

    initializeChapters(){
        this.chapters = this.firebaseService.getChapters(this.courseKey);
    }

    setNoteText(newText: string){
        this.text = newText;
    }

    createChapter(){
        if(this.courseKey != null){
            let info = {'key': this.courseKey};
            let modal = this.modalCtrl.create(CreateChapterPage, info);
            //Get back the course created
            modal.onDidDismiss(data => {
                if(data != null){
                }
                if(this.currentChapterKey == null || this.currentChapterKey == ''){
                  this.initializeChapters();
                  let that = this;
                  let setCurrentChapterKey = new Promise(function(resolve, reject){
                    that.firebaseService.getDB().database.ref('/courseChapters/'+that.courseKey).once('value').then(function(snapshot){
                      snapshot.forEach(function(chapter){
                        resolve(chapter.key);
                      });
                    });
                  });

                  setCurrentChapterKey.then(function(chapterKey: string){
                    that.currentChapterKey = chapterKey;
                  });
                }
            });
            modal.present();
        }
        // this.fileInput = document.getElementById("fileInput").dir;
        // console.log(this.fileInput);
    }
    updateNoteText(){
        let that = this;
        if((this.currentChapterKey == null || this.currentChapterKey == '') && this.courseKey != null && this.text != null){
            //needs to be done in order for the promise to recognize which object 'this' is referring
            this.getFirstChapterKey.then(function(firstKey){
                //default chapter is the first one
                that.firebaseService.getNoteText(that.courseKey,firstKey, that.inPublicNote)
                .then(function(noteText){
                    that.setNoteText(noteText);
                });
            });
        }else if(this.courseKey != null && this.text != null && this.currentChapterKey != ''){
            this.firebaseService.getNoteText(this.courseKey,this.currentChapterKey, this.inPublicNote)
            .then(function(noteText){
                that.setNoteText(noteText);
            });
        }
    }

    showNote(chapterKey){
        this.currentChapterKey = chapterKey;
        this.updateNoteText();
    }

    saveNote(){
        if((this.currentChapterKey == null || this.currentChapterKey == '') && this.courseKey != null && (this.text != null || this.text != '')){
            //needs to be done in order for the promise to recognize which object 'this' is referring to
            let that = this;
            this.getFirstChapterKey.then(function(firstKey){
                //defualt chapter is the first one
                that.firebaseService.saveNotes(that.courseKey,firstKey, that.text, that.inPublicNote);
            });
        }else if(this.courseKey != null && (this.text != null || this.text != '') && this.currentChapterKey != ''){
            this.firebaseService.saveNotes(this.courseKey,this.currentChapterKey, this.text, this.inPublicNote);
        }

        // let publicNoteText = this.firebaseService.getNoteText(this.courseKey, this.currentChapterKey, true, ).then();
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

}
