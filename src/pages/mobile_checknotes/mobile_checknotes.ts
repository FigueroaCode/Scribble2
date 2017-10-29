import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController, ToastController, Slides } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';


@Component({
  selector: 'page-checkmobile_notes',
  templateUrl: 'mobile_checknotes.html'
})

export class MobileCheckNotesPage {
    displayName: string;
    publicText: string;
    courseKey: string;
    chapterName: string;
    chapterKey: string;

    constructor(public navCtrl: NavController, public firebaseService: FirebaseService,
    public authService: AuthService, public alertCtrl: AlertController, public toastCtrl: ToastController,
    public modalCtrl: ModalController, public navParams: NavParams) {

        this.chapterName = navParams.get('chapterName');
        this.chapterKey = navParams.get('chapterKey');

        //Get the key of the course this belongs to
        this.courseKey = navParams.get('courseKey');
        //check that user exists
        if(this.authService.getFireAuth().currentUser)
            this.displayName = this.authService.getFireAuth().currentUser.displayName;
        //get and set the text from the database
        let that = this;
        firebaseService.getNoteText(that.displayName,this.courseKey, this.chapterKey, true)
        .then(function(noteText){
            that.setPublicNoteText(noteText);
        });
    }

    setPublicNoteText(newText: string){
        this.publicText = newText;
    }

}
