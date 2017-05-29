import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { CenterPage } from '../center/center';

@Component({
  selector: 'page-sign_in',
  templateUrl: 'sign_in.html'
})
export class SignInPage {

      constructor(public navCtrl: NavController) {

      }
      openPage() {
        this.navCtrl.setRoot(CenterPage);
      }
}
