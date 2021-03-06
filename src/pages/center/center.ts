import { Component, ViewChild } from '@angular/core';
import { NavController, Nav } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import firebase from 'firebase';

import { HomePage } from '../home/home';
import { CoursesPage } from '../courses/courses';
import { SignInPage } from '../sign_in/sign_in';
import { SavedCoursesPage } from '../savedcourses/savedcourses';

@Component({
  selector: 'page-center',
  templateUrl: 'center.html'
})

export class CenterPage {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = CoursesPage;

    pages: Array<{title: string, component: any}>;

    constructor(public navCtrl: NavController, public authService: AuthService) {
        //If no one is signed in, send them back to the home page
        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                navCtrl.setRoot(HomePage);
            }
        });
        this.pages = [
            {
                title: 'Courses',
                component: CoursesPage
            },
            {
                title: 'Saved Courses',
                component: SavedCoursesPage
            },
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
        //Sign Out User
        this.authService.doLogout();
      }else{
        this.nav.setRoot(page.component);
      }
    }
}
