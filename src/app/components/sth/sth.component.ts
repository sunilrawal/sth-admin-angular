import { Component, OnInit } from '@angular/core';
import { DBApiService } from '../../services/dbapi.service';
import { OrdersService } from '../../services/orders.service';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs'
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-sth',
  templateUrl: './sth.component.html',
  styleUrls: ['./sth.component.css']
})

export class SthComponent implements OnInit {

  dbOrders;
  orders;
  searchForm;
  searchMessageDisplay = 'd-none';
  inSearch : boolean = false;

  constructor(
    private dbapi : DBApiService,
    private ordersService : OrdersService,
    private loginService : LoginService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { 
    if (!this.loginService.isLoggedIn()) {
      router.navigate(['/']);
      return;
    }
    this.orders = this.ordersService.getOrders('sth');
    this.searchForm = this.formBuilder.group({
      identifier: ''
    });

    timer(0, 300000).subscribe(() => this.refreshData());
  }

  ngOnInit() {
  }

  refreshData() {
    this.dbapi.fetchOrders('sth', (orders) => {
      this.dbOrders = orders;
      this.ordersService.setOrders('sth', this.dbOrders);
      if (!this.inSearch) {
        this.orders = this.ordersService.getOrders('sth');
      }
    });
  }

  reset() {
    this.orders = this.ordersService.getOrders('sth');
    this.searchForm.reset();
  }

  search(searchData) {

    let identifier = searchData.identifier;
    this.searchMessageDisplay = 'd-none';
    this.ordersService.find('sth', identifier, (orders) => {

      if (orders && orders.length == 1) {
        this.router.navigate(['/orders', identifier]);
      } else if (orders && orders.length > 1) {
        console.log(`Multiple orders from ${identifier} [${orders.length}]`);
        this.orders = orders;
        this.inSearch = true;
      } else {
        this.searchMessageDisplay = 'd-inline';
      }
    });
  }

}