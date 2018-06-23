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

  //Check with the server to see if the JWT is valid
  checkAuthentication(){
    return new Promise((resolve, reject) => {

      //Load the token if it exists already
      this.storage.get('token').then((value) => {

        //If we get a token from local storage, store it in our provider variable
        this.token = value;

        //An instance of the Angular Headers class
        let headers = new Headers();

        //Append a header name of "Authorization" with a value of the retrieved token
        //If our server receives a request to a protected route without the Authorization heaader and a valid JWT, it will reject the request 
        headers.append('Authorization', this.token);    //The headers with the jwt get sent to the 

        //Use the Http client we brought in through the constructor to make the API call to the server using our custom headers
        //The /api/auth/protected route does not do anything except verify if the user is logged in. If the request suceeds, they are already logged in; if it fails, they are not
        this.http.get('http://localhost:3000/auth/protected', {headers: headers})
          .subscribe(res => {
            let data = res.json();    //Convert the response to JSON format
            this.token = data.token;  //The server passes the JWT to us in the response data, and we store it in our token variable
            this.storage.set('token', data.token);  //Then we put it in local storage for future reference
            resolve(data);            //Resolve

            resolve(res.json());
          }, (err) => {
            reject(err);              //Drat, a problem
          });

          //After we check to see if the user has a valid jwt, we need to make a call 
          //to the getCurrentUser method to obtain (at least) the user id from the server.
          //We can send that back with the data variable maybe


      });

      
    });
  }

  checkAuthentication2(){
 
    return new Promise((resolve, reject) => {
 
        //Load token if exists
        this.storage.get('token').then((value) => {
 
            this.token = value;
 
            let headers = new Headers();
            
            headers.append('Authorization', this.token);
 
            //If there is a stored token, send it to the server to decode. If it is valid, return the user data.
            this.http.get('http://localhost:3000/auth/jwtlogin', {headers: headers})
              .subscribe(res => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
 
        });        
 
    });
 
  }

  login(facebook_access_token){

    return new Promise((resolve, reject) => {

      //Angular Headers class
      //let headers = new Headers();

      //Tell what kind of content we are sending
      //headers.append('Content-Type', 'application/json');

      //Send the facebook access token we obtained along with our headers to our server via the api call
      this.http.post('http://localhost:3000/auth/facebook/callback', {access_token: facebook_access_token})
        .subscribe(res => {

          let data = res.json();    //Convert server response to JSON
          this.token = data.token;
          this.storage.set('token', data.token);
          resolve(data);

          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }


  //When the user logs out, all we need to do is remove the token from storage
  logout(){
    this.storage.set('token', '');
  }

}
