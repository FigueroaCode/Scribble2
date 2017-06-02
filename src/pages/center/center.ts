import { Component, ViewChild } from '@angular/core';
import { NavController, Nav } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';

import { HomePage } from '../home/home';
import { CoursesPage } from '../courses/courses';
import { SignInPage } from '../sign_in/sign_in';

@Component({
  selector: 'page-center',
  templateUrl: 'center.html'
})

export class CenterPage {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = CoursesPage;

    pages: Array<{title: string, component: any}>;

    constructor(public navCtrl: NavController, public authService: AuthService,
    public storage: Storage) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                navCtrl.setRoot(HomePage);
            }
        });
        this.pages = [
            {
                title: 'Sign Out',
                component: HomePage
            }
        ];
    }

    openPage(page) {
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      if(page.title == 'Sign Out'){
        //reset storage info
        this.storage.remove('email');
        //Sign Out User
        this.authService.doLogout();
      }else{
        this.nav.setRoot(page.component);
      }
    }
}
