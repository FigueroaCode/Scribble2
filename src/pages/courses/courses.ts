import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-courses',
  templateUrl: 'courses.html'
})

export class CoursesPage {

    constructor(public navCtrl: NavController) {

    }
}
