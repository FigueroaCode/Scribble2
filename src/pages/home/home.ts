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
    //Spell out this word character by character.
    let word = "";
    let finalWord = "Written notes are";
    let index = 0;
    this.interval = self.setInterval(function(){
      if(index < finalWord.length){
        word += finalWord[index];
        $('#homePageTitle').html(word);
        index++;
      }else{
        this.interval = null;
      }
    }, 100);

    this.interval = self.setInterval(function(){
      $('#changingWord').slideToggle();
      that.counter++;
      if(that.counter >= that.wordBank.length){
        this.interval = null;
      }
    }, 2000);

    //$('.header').delay(10000).slideToggle();

    // this.interval = self.setInterval(function(){
    //   $('#changingWord').slideToggle(1000);
    //   that.counter++;
    //   if(that.counter >= that.wordBank.length){
    //     that.counter = 0;
    //   }
    //   $('#changingWord').delay(1000).html(that.wordBank[that.counter]);
    // },2000);
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
