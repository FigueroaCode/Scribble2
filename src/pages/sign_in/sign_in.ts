import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

import { CenterPage } from '../center/center';
import { ResetPasswordPage } from '../resetpassword/resetpassword';

@Component({
  selector: 'page-sign_in',
  templateUrl: 'sign_in.html'
})
export class SignInPage {
        email: string;
        password: string;
        loading: any;

      constructor(public navCtrl: NavController, public authService: AuthService,
        public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
        this.email = '';
        this.password = '';
      }
      // --  Sign In User --
      signInUser() {
        if(this.email != '' && this.password != ''){
            this.authService.doLogin(this.email,this.password).then(
                authService => {
                    this.navCtrl.setRoot(CenterPage);
                }, error => {
                    // Handle errors
                    this.loading.dismiss().then(
                        () => {
                        // Alert User of error
                            let alert = this.alertCtrl.create({
                                message: error.message,
                                buttons: [
                                    {
                                        text: 'ok',
                                        role: 'cancel'
                                    }
                                ]
                            });
                            alert.present();
                        });
                });

                this.loading = this.loadingCtrl.create({
                    dismissOnPageChange: true,
                });
                this.loading.present();

        }

      }

      emailChanged(input){
        this.email = input._value;
      }

      passwordChanged(input){
        this.password = input._value;
      }

      resetPassword(){
        this.navCtrl.push(ResetPasswordPage);
      }
}
