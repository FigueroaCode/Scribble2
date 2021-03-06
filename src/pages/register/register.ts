import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

import { CenterPage } from '../center/center';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
    username: string;
    university: string;
    email: string;
    password: string;
    loading: any;

  constructor(public navCtrl: NavController , public authService: AuthService,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.username = '';
    this.email = '';
    this.password = '';
  }

    usernameChanged(input){
        this.username = input._value;
    }

    universityChanged(input){
        this.university = input._value;
    }

    emailChanged(input){
        this.email = input._value;
    }

    passwordChanged(input){
        this.password = input._value;
    }

    registerUser(){
        if(this.email != '' && this.password != ''){
            this.authService.register(this.username,this.university,this.email,this.password).then(
                authService => {
                    this.navCtrl.setRoot(CenterPage);
                }, error => {
                    this.loading.dismiss().then( () => {
                        let alert = this.alertCtrl.create({
                            message: error.message,
                            buttons: [
                                {
                                    text: "ok",
                                    role: "cancel"
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

}
