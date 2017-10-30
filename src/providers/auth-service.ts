import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AuthService {
    public fireAuth: any;

    constructor(public fireDB: AngularFireDatabase) {
        this.fireAuth = firebase.auth();
    }

    getFireAuth(){
        return this.fireAuth;
    }

    googleLogIn(){
        let provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
        firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        //var token = result.credential.accessToken;
        // ...
      }
      // The signed-in user info.
      //var user = result.user;
        }).catch(function(error) {
          // Handle Errors here.
         // var errorCode = error.code;
          //var errorMessage = error.message;
          // The email of the user's account used.
          //var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          //var credential = error.credential;
          // ...
        });
    }
    

    doLogin(email: string, password: string): any {
    this.fireDB.database.goOnline();
    return this.fireAuth.signInWithEmailAndPassword(email, password);
    }

    register(username: string, email: string, password: string): any {
        return this.fireAuth.createUserWithEmailAndPassword(email, password)
            .then((newUser) => {
                //Save username
                newUser.updateProfile({
                    displayName: username
                });

                //create a user profile in the database
                let user = {'name': username, 'courses': ''};
                this.fireDB.list('/Users/').push(user);
            });
    }
    resetPassword(email: string): any {
      return this.fireAuth.sendPasswordResetEmail(email);
    }

    doLogout(): any {
        this.fireDB.database.goOffline();
        return this.fireAuth.signOut();
    }
}
