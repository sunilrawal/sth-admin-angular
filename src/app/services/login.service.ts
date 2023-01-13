import { Injectable } from '@angular/core';
import { DBApiService } from '../services/dbapi.service';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  loggedIn = false;
  isSuperAdmin = false;

  constructor(
    private dbapi : DBApiService,
  ) { }

  login(pwd, callback) {
    this.dbapi.fetchLogin(pwd, (status, isSuperAdmin) => {
      this.loggedIn = status;
      this.isSuperAdmin = isSuperAdmin;
      callback(status);
    });
  }
  
  isLoggedIn() {
    return this.loggedIn;
  }

}