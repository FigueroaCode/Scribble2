import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SignInPage } from '../sign_in/sign_in';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    signInPage = SignInPage;
    registerPage = RegisterPage;

  constructor(public navCtrl: NavController) {

  }

}
