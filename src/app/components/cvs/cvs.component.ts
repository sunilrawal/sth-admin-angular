import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cvs',
  templateUrl: './cvs.component.html',
  styleUrls: ['./cvs.component.css']
})

export class CvsComponent implements OnInit {

  constructor(
    private loginService : LoginService,
    private router: Router
  ) { 
    if (!this.loginService.isLoggedIn()) {
      router.navigate(['/']);
      return;
    }
  }

  ngOnInit() {
  }


}