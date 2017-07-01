import { Component, NgZone } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { global } from '../../app/global';
import firebase from 'firebase';

import { SignInPage } from '../sign_in/sign_in';
import { CenterPage } from '../center/center';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    zone: NgZone;
    loading: any;
    signingIn: boolean;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
        this.zone = new NgZone({});
        this.signingIn = false;
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

  signIn(){
    this.navCtrl.push(SignInPage);
  }

  register(){
    this.navCtrl.push(RegisterPage);
  }

}
