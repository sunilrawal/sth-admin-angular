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

  orders;
  searchForm;
  searchMessageDisplay = 'd-none';

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
      orderId: ''
    });

    timer(0, 60000).subscribe(() => this.refreshData());
  }

  ngOnInit() {
  }

  refreshData() {
    this.dbapi.fetchOrders('sth', (orders) => {
      this.ordersService.setOrders('sth', orders);
      this.orders = this.ordersService.getOrders('sth');
    });
  }

  onSubmit(searchData) {
    // Process checkout data here
    let orderId = searchData.orderId;
    this.searchMessageDisplay = 'd-none';
    this.ordersService.find('sth', orderId, (order) => {
      if (order) {
        this.router.navigate(['/orders', orderId]);
      } else {
        this.searchMessageDisplay = 'd-inline';
      }
    });
  }

}