import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, Slides } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { global } from '../../app/global';
import firebase from 'firebase';

import { SignInPage } from '../sign_in/sign_in';
import { CenterPage } from '../center/center';
import { RegisterPage } from '../register/register';

import * as $ from 'jquery'

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
      $('#changingWord').slideUp(3000);
      that.counter++;
      if(that.counter >= that.wordBank.length){
        that.counter = 0;
      }
      that.changingWord = that.wordBank[that.counter];
      $('#changingWord').slideDown(3000);
    },3000);
  }

  ionViewDidLeave(){
    window.clearInterval(this.interval)
  }

  signIn(){
    this.navCtrl.push(SignInPage);
  }

  register(){
    this.navCtrl.push(RegisterPage);
  }

  nextSlide(){
    this.slides.slideNext(500,false);
  }

  previousSlide(){
    this.slides.slidePrev(500,false);
  }

}
