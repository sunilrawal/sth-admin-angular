import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm;
  loginMessageDisplay = 'd-none';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService : LoginService,
    private statsService : StatsService
  ) { 
      this.loginForm = this.formBuilder.group({
        pwd: ''
      });
  }
  

  ngOnInit() {
    const userStatus = localStorage.getItem('jpeg-login');
    if (userStatus === 'admin') {
      this.loginService.loggedIn = true;
      this.loginService.isSuperAdmin = false;
      this.router.navigate(['/sth']);
    } else if (userStatus === 'superadmin') {
        this.loginService.loggedIn = true;
        this.loginService.isSuperAdmin = true;
        this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(loginData) {
    
    let pwd = loginData.pwd;
    this.loginMessageDisplay = 'd-none';

    this.loginService.login(pwd, (success : boolean) => {
      if (success) {
        const userStatus = this.loginService.isSuperAdmin ? 'superadmin' : 'admin';
        localStorage.setItem('jpeg-login', userStatus);
        if (this.loginService.isSuperAdmin) this.router.navigate(['/dashboard']);
        else this.router.navigate(['/sth']);
      } else {
        this.loginMessageDisplay = 'd-inline';
      }
    });
  }


}