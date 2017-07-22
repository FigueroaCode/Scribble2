import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';


@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html'
})

export class NotesPage {

    courses: FirebaseListObservable<any[]>;
    displayName: string;
    text: string;
    //Set defualt Segment to the main Note
    noteSegment: string = "publicNote";

    constructor(public navCtrl: NavController, public firebaseService: FirebaseService,
    public authService: AuthService, public alertCtrl: AlertController) {
        //check that user exists
        if(this.authService.getFireAuth().currentUser)
            this.displayName = this.authService.getFireAuth().currentUser.displayName;
    }

    saveNote(){
        if(this.text != null)
            this.firebaseService.saveNotes({user: this.displayName, text: this.text});
    }
}
