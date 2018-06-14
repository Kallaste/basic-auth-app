import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
 
@Component({
  selector: 'login-page',
  templateUrl: 'login-page.html'
})
export class LoginPage {
 
    email: string;
    password: string;
    loading: any;     //A visual loading animation to show the user we are doing something
 
    constructor(public navCtrl: NavController, public authService: AuthProvider, public loadingCtrl: LoadingController) {
 
    }
    
    //This is called automaticaly when the page loads. 
    //If the user has a valid JWT, they are already logged in and can be redirected to whatever page we want to show them.
    ionViewDidLoad() {
 
        //Use the loading animation
        this.showLoader();
 
        //Check if already authenticated, i.e, see if they have a valid JWT
        this.authService.checkAuthentication().then((res) => {
            console.log("Already authorized");    //Our authservice returns a promise. If promise is resolved, the user has a valid JWT.
            this.loading.dismiss();
            this.navCtrl.setRoot(HomePage);       //Logged in, redirect to home page
        }, (err) => {
            console.log("Not already authorized");
            this.loading.dismiss();       //Stop loading animation
        });
 
    }
 
    login(){
 
        this.showLoader();
 
        //Get credentials to send to our auth provider
        let credentials = {
            email: this.email,
            password: this.password
        };
 
        this.authService.login(credentials).then((result) => {
            this.loading.dismiss();
            console.log(result);
            this.navCtrl.setRoot(HomePage);
        }, (err) => {
            this.loading.dismiss();
            console.log(err);
        });
 
    }
 
    //Send user to signup page
    launchSignup(){
        this.navCtrl.push(SignupPage);
    }
 
    showLoader(){
 
        this.loading = this.loadingCtrl.create({
            content: 'Authenticating...'
        });
 
        this.loading.present();
 
    }
 
}