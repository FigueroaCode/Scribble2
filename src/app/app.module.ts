import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AuthService } from '../providers/auth-service';
import { FirebaseService } from '../providers/firebase-service';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import firebase from 'firebase';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignInPage } from '../pages/sign_in/sign_in';
import { RegisterPage} from '../pages/register/register';
import { CoursesPage } from '../pages/courses/courses';
import { CenterPage } from '../pages/center/center';
import { ResetPasswordPage } from '../pages/resetpassword/resetpassword';

export const firebaseConfig = {
    apiKey: "AIzaSyBigCugTwNIJnJ2HKVV4GHGzjRxBYYc0Lk",
    authDomain: "scribbledb-eb51b.firebaseapp.com",
    databaseURL: "https://scribbledb-eb51b.firebaseio.com",
    projectId: "scribbledb-eb51b",
    storageBucket: "scribbledb-eb51b.appspot.com",
    messagingSenderId: "317744421633"
}

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignInPage,
    RegisterPage,
    CoursesPage,
    CenterPage,
    ResetPasswordPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    IonicStorageModule.forRoot(),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignInPage,
    RegisterPage,
    CoursesPage,
    CenterPage,
    ResetPasswordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    FirebaseService
  ]
})
export class AppModule {}
