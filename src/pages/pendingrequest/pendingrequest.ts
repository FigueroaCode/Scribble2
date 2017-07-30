import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

import { HomePage } from '../home/home';


@Component({
  selector: 'page-pendingrequest',
  templateUrl: 'pendingrequest.html'
})
export class PendingRequestPage {

      constructor(public navCtrl: NavController, public authService: AuthService,
        public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
      }
}
