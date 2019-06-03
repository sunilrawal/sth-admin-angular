import { Injectable } from '@angular/core';
import { DBApiService } from '../services/dbapi.service';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  loggedIn = false;

  constructor(
    private dbapi : DBApiService,
  ) { }

  login(pwd, callback) {
    this.dbapi.fetchLogin(pwd, (status) => {
      console.log(`Login ${status}`);
      this.loggedIn = status;
      callback(status);
    });
  }
  
  isLoggedIn() {
    return this.loggedIn;
  }
}