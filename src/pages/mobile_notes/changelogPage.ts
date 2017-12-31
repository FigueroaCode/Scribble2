import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { FirebaseListObservable } from 'angularfire2/database';


@Component({
  selector: 'page-changelogPage',
  templateUrl: 'changelogPage.html'
})

export class ChangeLogPage {

  changes: Array<any>;
  chaperKey: string;

  constructor(public viewCtrl: ViewController, public params: NavParams, public firebaseService: FirebaseService){
    this.chaperKey = params.get('chapterKey');
    let that = this;

    firebaseService.getChangeLog(this.chaperKey).then(function(change_array){
      that.changes = change_array as Array<any>;
    });
  }

  close(){
    this.viewCtrl.dismiss();
  }
}
