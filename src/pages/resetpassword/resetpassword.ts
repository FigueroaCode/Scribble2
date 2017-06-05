import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';


@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html'
})
export class ResetPasswordPage {
        email: string;
        loading: any;

      constructor(public navCtrl: NavController, public authService: AuthService,
        public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
        this.email = '';
      }
      // --  Reset Password -- //
      resetPassword() {
        if(this.email != ''){
            this.authService.resetPassword(this.email).then(
                authService => {
                    //this.navCtrl.setRoot(HomePage);
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

}
