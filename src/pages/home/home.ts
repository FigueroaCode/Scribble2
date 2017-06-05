import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';

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
    loading: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    private storage: Storage, private authService: AuthService) {

        storage.get('email').then((email) => {
            if(email != null){
                storage.get('password').then( (password) => {
                    if(password != null){
                        navCtrl.setRoot(CenterPage);

                        this.loading = this.loadingCtrl.create({
                            dismissOnPageChange: true,
                        });
                        this.loading.present();
                    }
                });
            }
        });
  }

}
