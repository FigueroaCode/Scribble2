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
import { Autosize } from '../providers/textarea-directive';
import { File } from '@ionic-native/file';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignInPage } from '../pages/sign_in/sign_in';
import { RegisterPage} from '../pages/register/register';
import { CoursesPage } from '../pages/courses/courses';
import { CreateCoursePage } from '../pages/courses/create_course';
import { CenterPage } from '../pages/center/center';
import { NotesPage } from '../pages/notes/notes';
import { CreateChapterPage } from '../pages/notes/create_chapter';
import { ResetPasswordPage } from '../pages/resetpassword/resetpassword';
import { JoinCoursePage } from '../pages/joincourse/joincourse';
import { User } from '../models/user';

export const firebaseConfig = {
    apiKey: "AIzaSyAzEAPiDw8-K235uSq_wfrNPIAZyRivsAE",
    authDomain: "scribble-c789c.firebaseapp.com",
    databaseURL: "https://scribble-c789c.firebaseio.com",
    projectId: "scribble-c789c",
    storageBucket: "",
    messagingSenderId: "89331952725"
}

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignInPage,
    RegisterPage,
    CoursesPage,
    CreateCoursePage,
    CenterPage,
    ResetPasswordPage,
    JoinCoursePage,
    NotesPage,
    CreateChapterPage,
    Autosize
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
    CreateCoursePage,
    CenterPage,
    ResetPasswordPage,
    JoinCoursePage,
    NotesPage,
    CreateChapterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    FirebaseService,
    File
  ]
})
export class AppModule {}
