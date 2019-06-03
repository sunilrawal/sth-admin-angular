import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

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
  ) { 
        this.loginForm = this.formBuilder.group({
          pwd: ''
        });
  }
  

  ngOnInit() {
  }

  onSubmit(loginData) {
    // Process checkout data here
    let pwd = loginData.pwd;
    this.loginMessageDisplay = 'd-none';

    this.loginService.login(pwd, (success : boolean) => {
      console.log(success);
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.loginMessageDisplay = 'd-inline';
      }
    });

  }

}