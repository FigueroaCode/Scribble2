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
    //Spell out this word character by character.
    let word = "";
    let finalWord = "Scribble Platform";
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

    //Timer by 1600

    this.interval = self.setTimeout(function(){
      $('#homePageTitle').slideToggle(500);
    },1700);

    this.interval = self.setTimeout(function(){
      $('#homePageTitle').slideToggle(500);
      $('.background').css('background-image','none');
    }, 1800);

    this.interval = self.setTimeout(function(){
      $('#homePageTitle').css('font-family','Zekton');
      $('#homePageTitle').css('font-size','10vw');
      $('#homePageTitle').css('margin-left','10vw');
    },2200);

    this.interval = self.setTimeout(function(){
      $('#homePageTitle').transition({ y: '-20vh', duration: 2000, scale: 0.8 });
    },2400);
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
