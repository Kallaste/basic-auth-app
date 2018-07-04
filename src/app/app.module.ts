import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
//import { Storage } from '@ionic/storage';  //Don't do this. Ionic keeps changing their syntax and it doesn't work anymore. 
import { IonicStorageModule } from '@ionic/storage' //Do this instead. Must be a lower case S in 'storage.'
import { HttpModule} from '@angular/http';    //We need this to use Http, or we will get a NullInjectorError

import { Facebook } from '@ionic-native/facebook';    //This is the module we installed with the 'ionic cordova add <APP_ID> <APP_NAME>' command

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { AuthProvider } from '../providers/auth/auth';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot()    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage
  ],
  providers: [
    //Storage,    //This is ionic's storage service; we need it to store the JWT in local storage
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    Facebook          
  ]
})
export class AppModule {}
