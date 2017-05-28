import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignInPage } from '../pages/sign_in/sign_in';
import { RegisterPage} from '../pages/register/register';

export const firebaseConfig = {
    apiKey: "AIzaSyBigCugTwNIJnJ2HKVV4GHGzjRxBYYc0Lk",
    authDomain: "scribbledb-eb51b.firebaseapp.com",
    databaseURL: "https://scribbledb-eb51b.firebaseio.com",
    projectId: "scribbledb-eb51b",
    storageBucket: "scribbledb-eb51b.appspot.com",
    messagingSenderId: "317744421633"
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignInPage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignInPage,
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
