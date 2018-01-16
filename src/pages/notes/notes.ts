import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, AlertController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { AngularFireList } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';
import { File } from '@ionic-native/file';
import { ChangesPage } from '../changelog/changelog';

import { Chapter } from '../../models/chapter';
import { Change } from '../../models/change';
import { MergeHandler } from '../../models/mergeHandler';
import { MobileNotesPage } from '../mobile_notes/mobile_notes';

@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html'
})

export class NotesPage {
    @ViewChild("fileInput") fileInput;
    chapters: AngularFireList<any[]>;
    displayName: string;
    publicText: string;
    privateText: string;
    courseKey: string;
    currentChapterKey: string;
    inPublicNote: boolean;
    //Set defualt Segment to the main Note
    noteSegment: string = "privateNote";
    getFirstChapterKey: Promise<any>;
    getFirebase: Promise<any>;
    dropDownTitle: string;
    chosenFileName: string;
    isApp: boolean;
    timeLimit: number;
    voteInProgress: boolean = false;

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
        this.inPublicNote = false;

        let that = this;
        //get time limit for voting in this course
        firebaseService.getTimeLimit(this.courseKey).then(function(timelimit){
          that.timeLimit = timelimit as number;
        });

        //check that user exists
        if(this.authService.getFireAuth().currentUser)
            this.displayName = this.authService.getFireAuth().currentUser.displayName;

        this.initializeChapters();
        //set the first chapter as the default
        this.getFirstChapterKey =  new Promise(function(resolve, reject){
            getCourseKey.then(function(courseKey){
                firebaseService.getDB().list('/courseChapters/'+courseKey).snapshotChanges(['child_added']).subscribe(function(snapshot){
                         snapshot.forEach(function(childsnapshot){
                             resolve(childsnapshot.key);
                            }
                        );
                    });
            });
        });
        //Set the textbox to the text of the first chapter
        this.getFirstChapterKey.then(function(chapterKey){
            firebaseService.getDB().list('/courseChapters/' + that.courseKey + '/' + chapterKey).snapshotChanges(['child_added'])
            .subscribe(function(getChapterName){
              getChapterName.forEach(function(chapter){
                if(chapter.key == 'chapterName'){
                  that.dropDownTitle = chapter.payload.val();
                }
              })
            });
            firebaseService.getNoteText(that.displayName,that.courseKey, chapterKey, true)
            .then(function(noteText){
                that.setPublicNoteText(noteText);
            });
            firebaseService.getNoteText(that.displayName,that.courseKey, chapterKey, false)
            .then(function(noteText){
                that.setPrivateNoteText(noteText);
            });

            that.changeVoteState(chapterKey);
        });

        this.dropDownTitle = "No Chapters Exist";
        this.chosenFileName = "IMPORT TEXT FILE";
    }

    initializeChapters(){
      let that = this;
      this.firebaseService.getChapters(this.courseKey).then(function(chapterList){
        that.chapters = chapterList as AngularFireList<any[]>;
      });
    }

    turnOffVoteListener(chapterKey: string){
      //this.firebaseService.getDB().database.ref('/ChangeLogQueue/'+chapterKey).off();
    }

    changeVoteState(chapterKey: string){
      //constantly check if there is a vote in progress
      // let that = this;
      // this.firebaseService.getDB().database.ref('/ChangeLogQueue/'+chapterKey).on('value', function(snapshot){
      //   if(snapshot.val() != null && snapshot.val().state){
      //     that.voteInProgress = true;
      //     //check if there is a vote in session
      //     //if there is then check if its still within the timeLimit
      //     //if its not then start merge
      //     if(that.voteInProgress){
      //       that.firebaseService.withinTimeLimit(that.timeLimit,chapterKey).then(function(state){
      //         if(!state){
      //           //start merging process
      //           console.log('do some merge magic');
      //           that.firebaseService.clearChangeLog(chapterKey);
      //           that.firebaseService.setVoteStatus(chapterKey,false);
      //           that.firebaseService.removeUserVoted(chapterKey);
      //         }
      //       });
      //     }
      //   }else{
      //     that.voteInProgress = false;
      //   }
      // });
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
                let chapterKey = this.firebaseService.addChapter(newChapter, this.courseKey, {owner: this.displayName, privateNoteText: "", dateUpdated: dateCreated});
                //if its the first chapter then set it as the selected one
                if(this.dropDownTitle == "No Chapters Exist"){
                  //turn off old chapter vote listener
                  if(this.currentChapterKey != null || this.currentChapterKey != ''){
                    this.turnOffVoteListener(this.currentChapterKey);
                  }else{
                    let that = this;
                    this.getFirstChapterKey.then(function(chapterKey){
                       that.turnOffVoteListener(chapterKey);
                    });
                  }
                  this.currentChapterKey = chapterKey;
                  this.updatePrivateNoteText();
                  this.updatePublicNoteText();
                  this.dropDownTitle = newChapter.getName();
                  this.changeVoteState(this.currentChapterKey);
                }
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
    updatePublicNoteText(){
        let that = this;
        if((this.currentChapterKey == null || this.currentChapterKey == '') && this.courseKey != null && this.privateText != null){
            //needs to be done in order for the promise to recognize which object 'this' is referring
            this.getFirstChapterKey.then(function(firstKey){
                //default chapter is the first one
                that.firebaseService.getNoteText(that.displayName,that.courseKey,firstKey, true)
                .then(function(noteText){
                    that.setPublicNoteText(noteText);
                });
            });
        }else if(this.courseKey != null && this.privateText != null && this.currentChapterKey != ''){
            that.firebaseService.getNoteText(that.displayName,that.courseKey,that.currentChapterKey, true)
            .then(function(noteText){
                that.setPublicNoteText(noteText);
            });
        }
    }
    updatePrivateNoteText(){
        let that = this;
        if((this.currentChapterKey == null || this.currentChapterKey == '') && this.courseKey != null && this.privateText != null){
            //needs to be done in order for the promise to recognize which object 'this' is referring
            this.getFirstChapterKey.then(function(firstKey){
                //default chapter is the first one
                that.firebaseService.getNoteText(that.displayName,that.courseKey,firstKey, false)
                .then(function(noteText){
                    that.setPrivateNoteText(noteText);
                });
            });
        }else if(this.courseKey != null && this.privateText != null && this.currentChapterKey != ''){
            that.firebaseService.getNoteText(that.displayName,that.courseKey,that.currentChapterKey, false)
            .then(function(noteText){
                that.setPrivateNoteText(noteText);
            });
        }
    }

    showNote(chapterKey, chapterName){
        //turn off old chapter vote listener
        console.log('chapter', chapterKey)
        if(this.currentChapterKey != null || this.currentChapterKey != ''){
          this.turnOffVoteListener(this.currentChapterKey);
        }else{
          let that = this;
          this.getFirstChapterKey.then(function(chapterKey){
             that.turnOffVoteListener(chapterKey);
          });
        }
        this.currentChapterKey = chapterKey;
        this.updatePrivateNoteText();
        this.updatePublicNoteText();
        this.dropDownTitle = chapterName;
        this.changeVoteState(this.currentChapterKey);
    }

    saveNote(){
        if((this.currentChapterKey == null || this.currentChapterKey == '') && this.courseKey != null && (this.privateText != null || this.privateText != '')){
            //needs to be done in order for the promise to recognize which object 'this' is referring to
            let that = this;
            this.getFirstChapterKey.then(function(firstKey){
                //default chapter is the first one
                that.firebaseService.saveNotes(that.displayName,that.courseKey,firstKey, that.privateText, false);
            });
        }else if(this.courseKey != null && (this.privateText != null || this.privateText != '') && this.currentChapterKey != ''){
            this.firebaseService.saveNotes(this.displayName,this.courseKey,this.currentChapterKey, this.privateText, false);
        }
    }

    //Switching Between Notes
    publicNoteClicked(){
        this.inPublicNote = true;
        //this.updateNoteText();
    }

    privateNoteClicked(){
        this.inPublicNote = false;
        //this.updateNoteText();
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
      let that = this;
      if((this.currentChapterKey == null || this.currentChapterKey == '') && this.courseKey != null && (this.privateText != null && this.privateText != '')){
          //needs to be done in order for the promise to recognize which object 'this' is referring to
          this.getFirstChapterKey.then(function(firstKey){
              //default chapter is the first one
              that.firebaseService.saveNotes(that.displayName, that.courseKey,firstKey, that.privateText, false);
              if(that.publicText == null || that.publicText == ''){
                that.firebaseService.saveNotes(that.displayName,that.courseKey,firstKey, that.privateText, true);
                that.updatePublicNoteText();
              }else{
                that.firebaseService.isVoteInProgress(firstKey).then(function(state){
                  if(!state && that.privateText != that.publicText){
                    let mergeHandler = new MergeHandler(that.privateText, that.publicText,firstKey,that.courseKey, false, that.firebaseService);
                  }else{
                    //tell user that a vote is in progress, and maybe how much time is left on it
                  }
                });
              }
          });
      }else if(this.courseKey != null && (this.privateText != null && this.privateText != '') && this.currentChapterKey != ''){
          this.firebaseService.saveNotes(this.displayName,this.courseKey,this.currentChapterKey, this.privateText, false);
          if(this.publicText == null || this.publicText == ''){
            this.firebaseService.saveNotes(this.displayName,this.courseKey,this.currentChapterKey, this.privateText, true);
            this.updatePublicNoteText();
          }else{
            this.firebaseService.isVoteInProgress(this.currentChapterKey).then(function(state){
              if(!state || state != null && that.privateText != that.publicText){
                let mergeHandler = new MergeHandler(that.privateText, that.publicText,that.currentChapterKey,that.courseKey, false, that.firebaseService);
              }else{
                //tell user that a vote is in progress, and maybe how much time is left on it
              }
            });
          }

      }
    }

    viewChangeLog(){
      let that = this;
      if((this.currentChapterKey == null || this.currentChapterKey == '') && this.courseKey != null){
          //needs to be done in order for the promise to recognize which object 'this' is referring
          this.getFirstChapterKey.then(function(firstKey){
            let data = {'chapterKey': firstKey, 'timelimit': that.timeLimit};
            that.navCtrl.push(ChangesPage,data);
          });
      }else if(this.courseKey != null && this.currentChapterKey != ''){
        let data = {'chapterKey':this.currentChapterKey, 'timelimit': this.timeLimit};
        this.navCtrl.push(ChangesPage, data);
      }
    }

    deleteChapter(){

    }

    //-----------------------Mobile----------------//
    sendToNotes(chapterName, chapterKey){
      let data = {'chapterName': chapterName, 'chapterKey': chapterKey, 'courseKey': this.courseKey};
      this.navCtrl.push(MobileNotesPage, data);
    }

}
