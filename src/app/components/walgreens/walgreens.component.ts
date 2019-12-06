import { Component, OnInit } from '@angular/core';
import { DBApiService } from '../../services/dbapi.service';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-walgreens',
  templateUrl: './walgreens.component.html',
  styleUrls: ['./walgreens.component.css']
})

export class WalgreensComponent implements OnInit {

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