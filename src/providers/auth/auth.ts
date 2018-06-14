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
        headers.append('Authorization', this.token);

        //Use the Http client we brought in through the constructor to make the API call to the server using our custom headers
        //The /api/auth/protected route does not do anything except verify if the user is logged in. If the request suceeds, they are already logged in; if it fails, they are not
        this.http.get('http:localhost:8080/api/auth/protected', {headers: headers})
          .subscribe(res => {
            let data = res.json();    //Convert the response to JSON format
            this.token = data.token;  //The server passes the JWT to us in the response data, and we store it in our token variable
            this.storage.set('token', data.token);  //Then we put it in local storage for future reference
            resolve(data);            //Resolve

            resolve(res.json());
          }, (err) => {
            reject(err);              //Drat, a problem
          });


      });

      
    });
  }

  //Call this when we need to create a new user account
  createAccount(details){
 
    return new Promise((resolve, reject) => {
 
        //An instance of the Angular Headers class
        let headers = new Headers();
        //Let the server know what type of content we are sending
        headers.append('Content-Type', 'application/json');
 
        //Make the API call to the server to register the user
        this.http.post('http://localhost:8080/api/auth/register', JSON.stringify(details), {headers: headers})
          .subscribe(res => {
 
            let data = res.json();      //Convert response to JSON format
            this.token = data.token;    //Take the JWT the server gave us and store it in our variable
            this.storage.set('token', data.token);    //Then put it in local storage
            resolve(data);              //Done
 
          }, (err) => {
            reject(err);                //Or not
          });
 
    });
 
  }

  login(credentials){

    return new Promise((resolve, reject) => {

      //Angular Headers class
      let headers = new Headers();

      //Tell what kind of content we are sending
      headers.append('Content-Type', 'application/json');

      //Send the user credentials we collected along with our headers to our server via the api call
      this.http.post('http://localhost:8080/api/auth/login', JSON.stringify(credentials), {headers: headers})
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
