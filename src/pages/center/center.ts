import { Component, ViewChild } from '@angular/core';
import { NavController, Nav } from 'ionic-angular';

import { HomePage } from '../home/home';
import { CoursesPage } from '../courses/courses';

@Component({
  selector: 'page-center',
  templateUrl: 'center.html'
})

export class CenterPage {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = CoursesPage;

    pages: Array<{title: string, component: any}>;

    constructor(public navCtrl: NavController) {
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
        this.navCtrl.setRoot(page.component);
      }else{
        this.nav.setRoot(page.component);
      }
    }
}
