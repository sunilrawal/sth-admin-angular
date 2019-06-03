import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  loggedIn = false;

  constructor() { }

  login(pwd, callback) {

    this.loggedIn = true;
    callback(true);
  }
  
  isLoggedIn() {
    return this.loggedIn;
  }
}