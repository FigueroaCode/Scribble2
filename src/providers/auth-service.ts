import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';

@Injectable()
export class AuthService {
    public fireAuth: any;

    constructor() {
        this.fireAuth = firebase.auth();
    }

    getFireAuth(){
        return this.fireAuth;
    }

    doLogin(email: string, password: string): any {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
    }

    register(username: string, email: string, password: string): any {
        return this.fireAuth.createUserWithEmailAndPassword(email, password)
            .then((newUser) => {
                //Save username
                newUser.updateProfile({
                    displayName: username
                });
            });
    }
    resetPassword(email: string): any {
      return this.fireAuth.sendPasswordResetEmail(email);
    }

    doLogout(): any {
        return this.fireAuth.signOut();
    }
}
