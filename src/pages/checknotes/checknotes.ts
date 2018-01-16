import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, AlertController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { AngularFireList } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';
import { File } from '@ionic-native/file';

import { Chapter } from '../../models/chapter';
import { Change } from '../../models/change';
import { MergeHandler } from '../../models/mergeHandler';
import { MobileCheckNotesPage } from '../mobile_checknotes/mobile_checknotes';

@Component({
  selector: 'page-checknotes',
  templateUrl: 'checknotes.html'
})

export class CheckNotesPage {
    @ViewChild("fileInput") fileInput;
    chapters: AngularFireList<any[]>;
    displayName: string;
    publicText: string;
    courseKey: string;
    currentChapterKey: string;
    getFirstChapterKey: Promise<any>;
    getFirebase: Promise<any>;
    dropDownTitle: string;
    isApp: boolean;

    constructor(public navCtrl: NavController, public firebaseService: FirebaseService, public platform: Platform,
    public authService: AuthService, public alertCtrl: AlertController, public toastCtrl: ToastController,
    public modalCtrl: ModalController, public navParams: NavParams, private file: File) {
        //check which platform i am on
        if(this.platform.is('core') || this.platform.is('mobileweb')) {
          this.isApp = false;
        } else {
          this.isApp = true;
        }

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
        //check that user exists
        if(this.authService.getFireAuth().currentUser)
            this.displayName = this.authService.getFireAuth().currentUser.displayName;

        this.initializeChapters();
        //set the first chapter as the default
        this.getFirstChapterKey =  new Promise(function(resolve, reject){
            // getCourseKey.then(function(courseKey){
            //     firebaseService.getDB().object('/courseChapters/'+courseKey).$ref.once('value').then(function(snapshot){
            //              snapshot.forEach(function(childsnapshot){
            //                  resolve(childsnapshot.key);
            //                 }
            //             );
            //         });
            // });
        });
        //Set the textbox to the text of the first chapter
        let that = this;
        this.getFirstChapterKey.then(function(chapterKey){
            // firebaseService.getDB().object('/courseChapters/' + that.courseKey + '/' + chapterKey).$ref.once('value').then(function(getChapterName){
            //   that.dropDownTitle = getChapterName.val().chapterName;
            // });
            // firebaseService.getNoteText(that.displayName,that.courseKey, chapterKey, true)
            // .then(function(noteText){
            //     that.setPublicNoteText(noteText);
            // });
        });

        this.dropDownTitle = "No Chapters Exist";
    }

    initializeChapters(){
        //this.chapters = this.firebaseService.getChapters(this.courseKey);
    }

    setPublicNoteText(newText: string){
        this.publicText = newText;
    }
    updateNoteText(){
        let that = this;
        if((this.currentChapterKey == null || this.currentChapterKey == '') && this.courseKey != null){
            //needs to be done in order for the promise to recognize which object 'this' is referring
            this.getFirstChapterKey.then(function(firstKey){
                //default chapter is the first one
                that.firebaseService.getNoteText(that.displayName,that.courseKey,firstKey, true)
                .then(function(noteText){
                    that.setPublicNoteText(noteText);
                });
            });
        }else if(this.courseKey != null && this.currentChapterKey != ''){
            this.firebaseService.getNoteText(this.displayName,this.courseKey,this.currentChapterKey, true)
            .then(function(noteText){
                that.setPublicNoteText(noteText);
            });
        }
    }

    showNote(chapterKey, chapterName){
        this.currentChapterKey = chapterKey;
        this.updateNoteText();
        this.dropDownTitle = chapterName;
    }

    toggleDropDown() {
      document.getElementById("chapterDropdown").classList.toggle("show");
    }

    //-----------------------Mobile----------------//
    sendToNotes(chapterName, chapterKey){
      let data = {'chapterName': chapterName, 'chapterKey': chapterKey, 'courseKey': this.courseKey};
      this.navCtrl.push(MobileCheckNotesPage, data);
    }

}
