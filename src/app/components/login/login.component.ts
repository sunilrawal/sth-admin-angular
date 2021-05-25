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
    const ok = localStorage.getItem('login');
    console.log
    if (ok === 'ok') {
      this.loginService.loggedIn = true;
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(loginData) {
    
    let pwd = loginData.pwd;
    this.loginMessageDisplay = 'd-none';

    this.loginService.login(pwd, (success : boolean) => {
      if (success) {
        localStorage.setItem('login', 'ok');
        this.router.navigate(['/dashboard']);
      } else {
        this.loginMessageDisplay = 'd-inline';
      }
    });
  }


}