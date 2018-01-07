import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, Slides } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { global } from '../../app/global';
import firebase from 'firebase';

import { SignInPage } from '../sign_in/sign_in';
import { CenterPage } from '../center/center';
import { RegisterPage } from '../register/register';

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
    wordBank: Array<string>;
    changingWord: string;
    counter: number;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
        this.zone = new NgZone({});
        this.appName = "Scribble Platform";
        this.counter = 0;
        this.wordBank = ['unorganized', 'easy to lose', 'difficult to update'];
        this.changingWord = this.wordBank[this.counter];

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

}
