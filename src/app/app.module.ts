import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
//import { Storage } from '@ionic/storage';  //Don't do this. Ioinc keeps changing their syntax and it doesn't work anymore. 
//import { IonicStorageModule } from '@ionic/Storage';    
import { IonicStorageModule } from '@ionic/storage' //Do this instead. Must be capital S.
//import { IonicStorageModule } from '@ionic/storage';
import { HttpModule} from '@angular/http';    //We need this to use Http, or we will get a NullInjectorError that says "No provider for Http!"

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';

import { AuthProvider } from '../providers/auth/auth';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot()    //Test: Do we need this?
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage
  ],
  providers: [
    //Storage,    //This is ionic's storage service; we need it to store the JWT in local storage
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider
    //IonicStorageModule
  ]
})
export class AppModule {}
