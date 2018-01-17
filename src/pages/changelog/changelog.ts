import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, AlertController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { AngularFireList } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';
import { File } from '@ionic-native/file';

import { Chapter } from '../../models/chapter';
import { Change } from '../../models/change';
import { MergeHandler } from '../../models/mergeHandler';
import { MobileNotesPage } from '../mobile_notes/mobile_notes';

@Component({
  selector: 'page-changelog',
  templateUrl: 'changelog.html'
})

export class ChangesPage {
    changeLogAsync: AngularFireList<any[]>;
    changeLog: Array<any>;
    displayName: string;
    chapterKey: string;
    inVoteView: boolean;
    //Set defualt Segment to the main Note
    changeSegment: string = "voteView";
    isApp: boolean;
    timeLimit: number;

    constructor(public navCtrl: NavController, public firebaseService: FirebaseService, public platform: Platform,
    public authService: AuthService, public alertCtrl: AlertController, public toastCtrl: ToastController,
    public modalCtrl: ModalController, public navParams: NavParams, private file: File) {
        //check which platform i am on
        if(this.platform.is('core') || this.platform.is('mobileweb')) {
          this.isApp = false;
        } else {
          this.isApp = true;
        }

        //Get the key of the course this belongs to
        this.chapterKey = navParams.get('chapterKey');
        this.timeLimit = navParams.get('timelimit');
        this.inVoteView = true;
        this.changeLog = [];

        //check that user exists
        if(this.authService.getFireAuth().currentUser)
            this.displayName = this.authService.getFireAuth().currentUser.displayName;
        else{
          this.displayName = "";
        }

        this.initializeChangeLog();
        this.initializeChangeLogAsync();
        //TODO: this needs testing
        let that = this;
        // firebaseService.getDB().object('/ChangeLog/'+this.chapterKey).$ref.on('value', function(snapshot){
        //   if(snapshot.val() == null){
        //     if(that.changeLog.length > 0){
        //       that.changeLog.splice(0,that.changeLog.length);
        //     }
        //   }
        // });
    }

    initializeChangeLogAsync(){
      //this.changeLogAsync = this.firebaseService.getChangeLogAsync(this.chapterKey);
    }

    initializeChangeLog(){
      let that = this;
      this.firebaseService.hasUserVoted(this.chapterKey,this.displayName).then(function(voted){
        if(that.chapterKey != null && !voted){
          that.firebaseService.getChangeLog(that.chapterKey).then(function(change_array){
              that.changeLog = change_array as Array<any>;
          });
        }
      });
    }

    // removeChange(key){
    //   let that = this;
    //   this.changeLog.splice(this.changeLog.findIndex(function(change){
    //     if(change.key == key){
    //       that.changeQueue.push(change as Change);
    //       return true;
    //     }else{
    //        return false;
    //     }
    //   }), 1);
    // }

    upVote(change){
      change.upVoted = true;
    }

    downVote(change){
      change.upVoted = false;
    }
    confirmVotes(){
      //check that there is a vote in progress
      //then update the vote count on db with changeQueue
      //update the amount of members left to vote
      //if there are no more members left to vote or time limit is up, then start merge to public noteText
      //then clear the changes
      let that = this;
      this.firebaseService.hasUserVoted(this.chapterKey,this.displayName).then(function(voted){
        if(!voted){
          if(that.chapterKey != null){
            if(that.changeLog.length > 0){
              for(let i = 0; i < that.changeLog.length; i++){
                if(that.changeLog[i].upVoted){
                  that.changeLog[i].approvedVotes += 1;
                }else{
                  that.changeLog[i].disapprovedVotes += 1;
                }
                //keep it false on the database
                that.changeLog[i].upVoted = false;
                that.firebaseService.updateVoteCount(that.chapterKey,that.changeLog[i]);
              }
              //record user has voted
              that.firebaseService.userVoted(that.displayName, that.chapterKey);
              that.firebaseService.updateMemberCount(that.chapterKey).then(function(memberCount){
                that.firebaseService.withinTimeLimit(that.timeLimit,that.chapterKey).then(function(withinTime){
                  if(memberCount <= 0 || !withinTime){
                    // then start merge to public noteText
                    console.log('do some merge magic');
                    // then clear the changes
                    that.firebaseService.clearChangeLog(that.chapterKey);
                    //that.changeQueue.splice(0,that.changeQueue.length);
                    // set the ChangeLogQueue status to false
                    that.firebaseService.setVoteStatus(that.chapterKey,false);
                    //delete chapter from voted branch
                    that.firebaseService.removeUserVoted(that.chapterKey);
                  }
                });
                that.changeLog.splice(0,that.changeLog.length);
              });
            }else{
              //theres no changes
            }
          }
        }
      });

    }

    //Switching Between Notes
    voteViewClicked(){
        this.inVoteView = true;
    }

    statusViewClicked(){
        this.inVoteView = false;
    }
}
