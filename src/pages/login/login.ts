import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
 
@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {
 
    email: string;
    password: string;
    loading: any;     //A visual loading animation to show the user we are doing something
 
    constructor(public navCtrl: NavController, public authService: AuthProvider, public loadingCtrl: LoadingController, public fb: Facebook) {
 
    }
    
    //This is called automaticaly when the page loads. 
    //If the user has a valid JWT, they are already logged in and can be redirected to whatever page we want to show them.
    ionViewDidLoad() {
 
        //Use the loading animation
        this.showLoader();
 
        //Check if already authenticated, i.e, see if they have a valid JWT
        this.authService.checkAuthentication().then((res) => {
            console.log("Already authorized");      //Our authservice returns a promise. If promise is resolved, the user has a valid JWT.
            this.loading.dismiss();
            this.navCtrl.setRoot(HomePage);         //Logged in, redirect to home page
        }, (err) => {
            console.log("Not already authorized");
            this.loading.dismiss();                 //Stop loading animation
        });
 
    }

    //Called when a user clicks the "Log in with Facebook" button
    loginAction() {
    
    this.fb.login(['public_profile', 'user_photos', 'email', 'user_birthday'])
    .then((res: FacebookLoginResponse) => {

        //The Facebook connection was successful
        if(res.status == "connected") {

            //Get user id and facebook access token (we will send this token to our server so it can also retrieve the user's data from Facebook).
            var fb_id = res.authResponse.userID;
            var fb_token = res.authResponse.accessToken;

            //Call the Facebook API and request desired user data
            this.fb.api("/me?fields=name,gender,birthday,email", []).then((user) => {

                //At this point, you can get the connected user details directly from Facebook 
                var gender    = user.gender;
                var birthday  = user.birthday;
                var name      = user.name;
                var email     = user.email;

                console.log("**** USER PROFILE INFORMATION ****");
                console.log("Gender : " + gender);
                console.log("Birthday : " + birthday);
                console.log("Name : " + name);
                console.log("Email : " + email);


                this.showLoader();

                //Next, we need to connect with our server so we can recognize this user and store data about them.
                //The server will create a new Givdo profile for them if they are a new user, or else it will send back the existing profile details.

                //We will send the Facebook access token we were just given to our auth provider so we can do this.
                this.authService.login(fb_token).then((result) => {     //send the facebook access token to our auth provider
                    this.loading.dismiss();
                    console.log(result);
                    this.navCtrl.setRoot(HomePage);
                }, (err) => {
                    this.loading.dismiss();
                    console.log(err);
                });

            });

        } 
        //An error
        else {
            console.log("An error occurred during Facebook connection in login.ts");
        }

    })
    .catch((e) => {
        console.log('Error logging into Facebook', e);
    });
}
 

      
    //Create our loader animation and display it.
    showLoader(){         
        this.loading = this.loadingCtrl.create({content: 'Authenticating...'});
        this.loading.present();
    }
 }