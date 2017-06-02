import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { SignInPage } from '../sign_in/sign_in';
import { CenterPage } from '../center/center';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    signInPage = SignInPage;
    registerPage = RegisterPage;

  constructor(public navCtrl: NavController, private storage: Storage) {

        storage.get('email').then((val) => {
            if(val != null){
                navCtrl.setRoot(CenterPage);
            }
        });
  }

}
