import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { IonicStorageModule } from '@ionic/Storage';
//This goes with IonicStorageModule which we imported in app.module.ts; don't ask me why we need to use a different name here.
import { Storage } from '@ionic/storage';
/*
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  public token: any;    //the JSON web token our server will return for the user

  /* Pass the http client to the constructor so we can send the API call to the server over http, 
     and pass the storage provider so we can store the JWT */
  constructor(public http: Http, public storage: Storage) {
    console.log('AuthProvider working');
  }

  //Check with the server to see if the user has a valid jwt (this is called automatically in ionViewDidLoad(), when the login page loads)
  checkAuthentication(){
 
    return new Promise((resolve, reject) => {
 
        //Load the token if exists
        this.storage.get('token').then((value) => {
 
          //If we get a token from local storage, store it in our local variable in this provider
          this.token = value;
          
          //An instance of the Angular Headers class
          let headers = new Headers();

          //Tell what kind of content we are sending
          headers.append('Content-Type', 'application/json');
          
          //Append a header name of "Authorization" with a value of the retrieved token
          //If our server receives a request to a protected route without the Authorization heaader and a valid JWT, it will reject the request 
          headers.append('Authorization', this.token);
 
          //Send token to the server to decode. If it is valid, return the user data.
          this.http.get('http://localhost:3000/auth/checklogin', {headers: headers})
            .subscribe(res => {
                  resolve(res);
            }, (err) => {
                  reject(err);
            });
 
        });        
 
    });
 
  }

  //If we are here, it means the user was not already logged in (either because there was no jwt stored in local storage, 
  //or because the server checked the jwt and it was invalid). So now the user needs to log in by sending the facebook access token to our server.
  login(facebook_access_token){

    return new Promise((resolve, reject) => {

      //Send the facebook access token we obtained along with our headers to our server via the api call
      this.http.post('http://localhost:3000/auth/facebook/callback', {access_token: facebook_access_token})
        .subscribe(res => {

          let data = res.json();                  //Convert server response to JSON
          this.token = data.token;                //The server passes the JWT to us in the response data, and we store it in our token variable
          this.storage.set('token', data.token);  //Then we put it in local storage for future reference
          resolve(data);                          //Resolve promise

          resolve(res.json());
        }, (err) => {
          reject(err);                            //Drat, a problem
        });
    });
  }


  //When the user logs out, all we need to do is remove the token from storage
  logout(){
    this.storage.set('token', '');
  }

}
