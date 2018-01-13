import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, Slides } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { global } from '../../app/global';
import { ToastController } from 'ionic-angular';
import firebase from 'firebase';

import { SignInPage } from '../sign_in/sign_in';
import { CenterPage } from '../center/center';
import { RegisterPage } from '../register/register';
import { MiniHandler } from './miniHandler';
import { Change } from '../../models/change';

import * as $ from 'jquery.transit';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    zone: NgZone;
    loading: any;
    @ViewChild(Slides) slides: Slides;
    appName: string;
    interval: any;
    erasedTitle: string;
    newTitle: string;

    //Variables for merge area:
    document1: string;
    document2: string;
    changeLog: Array<Change>;
    mergeHandler: MiniHandler;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
        this.zone = new NgZone({});
        this.appName = "Scribble Platform";
        this.erasedTitle = "Here's how we merge your notes:";
        this.newTitle = "Vote on which changes to keep:";

        this.document1 = "Example: These are your notes, that you took in class. If you were more attentive than your classmates, your notes may be better, but it's possible you missed certain things. Feel free to erase this text, and try out your own combinations. By clicking the merge button, Scribble will merge your notes into the public notes.";
        this.document2 = "Example: These are other classmates'  notes, that they took in class. They may have written some things that you missed. By using Scribble to combine your notes, you ensure that no details are left out. Feel free to erase this text, and try out your own combinations. By clicking the merge button, Scribble will merge your notes into the public notes."
        //Send User to Course Page if hes already signed in
        firebase.auth().onAuthStateChanged((user) => {
            this.zone.run( () => {
                let view = this.navCtrl.getActive();
                if (user && !(view.instance instanceof SignInPage || view.instance instanceof RegisterPage)) {
                    navCtrl.setRoot(CenterPage);
                }
            });

        });
  }

  ionViewDidLoad(){
    let that = this;

    this.interval = self.setInterval(function(){

      //Move Left
      this.interval = self.setTimeout(function(){
         $('#item1').transit({
           marginLeft: '80rem',
           duration: 15000,
         });
      },1000);
      //Move Right
      this.interval = self.setTimeout(function(){
        $('#item1').transit({
          marginLeft: '260rem',
          duration: 15000,
        })
      },1000);

    },1000);

  }//End of onLoad animations.

  ionViewDidLeave(){
    window.clearInterval(this.interval)
  }

  signIn(){
    this.navCtrl.push(SignInPage);
  }

  register(){
    this.navCtrl.push(RegisterPage);
  }

  mergeDocuments(){
    let that = this;
    if( this.document1 != null && this.document2 != null){
      this.mergeHandler = new MiniHandler(this.document1, this.document2);
      this.changeLog = this.mergeHandler.changeLog;
      //Make the notes disappear, and have the changelog appear instead.
      this.interval = self.setTimeout(function(){
        $('#buttonFAB').transit({
          opacity: 0,
          duration: '500',
        });
        $('#buttonFAB').prop('disabled', true);
        $('#card1').transit({
          x: '-100vw',
          opacity: 0,
          duration: '1000',
        });
        $('#doc1Title').transit({
          x: '-100vw',
          opacity: 0,
          duration: '1000',
        });
        $('#card2').transit({
          x: '100vw',
          opacity: 0,
          duration: '1000',
        });
        $('#doc2Title').transit({
          x: '100vw',
          opacity: 0,
          duration: '1000',
        });
      }, 500);

      this.interval = self.setTimeout(function(){
        $('#card1Div').css({
          width: 0,
        });
        $('#card2Div').css({
          width: 0,
        });
        $('#changeLogDiv').transit({
          scale: 0,
        });
      }, 1500);

      this.interval = self.setTimeout(function(){
        $('#changeLogDiv').transit({
          display: 'block',
        });
      }, 1600);

      // Slowly re-type the title appearing above the changeLogDiv
      this.interval = self.setTimeout(function(){
        $('#changeLogDiv').transit({
          scale: 1,
          duration: 1000,
        });
      }, 1650);

      this.interval = self.setTimeout(function(){
        let index = that.erasedTitle.length;
        this.interval = self.setInterval(function(){
          if(index >= 0){
            that.erasedTitle = that.erasedTitle.substring(0, index);
            index--;
          }else{
            this.interval = null;
          }
        }, 50);
      },1650);

      this.interval = self.setTimeout(function(){
        that.retypeTitle();
      },3250);

    }else{
      //Notify user that they need to fill both text fields.
      let toast = this.toastCtrl.create({
        message: 'Please enter text into both text fields before attempting to merge.',
        duration: 3000,
        position: 'bottom',
      });

      toast.present(toast);
    }

  }//END OF METHOD

  retypeTitle(){
    let that = this;
    let length = that.newTitle.length;
    let index = 0;
    this.interval = self.setInterval(function(){
      if(index < length){
        that.erasedTitle += that.newTitle[index];
        index++;
      }else{
        that.interval = null;
      }
    }, 50);
  }//END OF METHOD

  upVote(item: Change){
    item.upVoted = true;
  }

  downVote(item: Change){
    item.upVoted = false;
  }

  updateVoteCount(){
    for(let change of this.changeLog){
      if(change.upVoted){
        change.approvedVotes += 1;
      }else{
        change.disapprovedVotes += 1;
      }
    }
  }

  confirmVotes(){
    this.updateVoteCount();
    this.mergeHandler.changeLog = this.changeLog;
    this.mergeHandler.mergeNotes();

    //Hide the change log, and reveal the results.
    this.interval = self.setTimeout(function(){
      $('#changeLogDiv').transit({
        x: '-100vw',
        duration: 1000,
      });
      $('#mergeTitle').transit({
        x: '-100vw',
        duration: 1000,
      });
    }, 200);

    this.interval = self.setTimeout(function(){
      $('#changeLogDiv').transit({
        display: 'none',
      });
      $('#mergeTitle').transit({
        display: 'none',
      });
      $('#resultsDiv').transit({
        x: '100vw',
      });
    }, 200);

    this.interval = self.setTimeout(function(){
      $('#resultsDiv').transit({
        display: 'block',
      });
      $('#resultsCard').transit({
        display: 'block',
      });
    }, 200);

    this.interval = self.setTimeout(function(){
      $('#resultsDiv').transit({
        x: '0',
        duration: 1000,
      })
    }, 300);

  }//END OF METHOD

}
