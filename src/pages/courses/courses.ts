import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-courses',
  templateUrl: 'courses.html'
})

export class CoursesPage {

    courses: Array<{title: string, content: string}>;

    constructor(public navCtrl: NavController) {
        this.initializeCourses();
    }

    initializeCourses(){
        this.courses = [
            {title: 'first',
            content: 'first c'},
            {title: 'second',
            content: 'second c'},
            {title: 'third',
            content: 'third c'}
        ];
    }

    getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeCourses();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.courses = this.courses.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}
