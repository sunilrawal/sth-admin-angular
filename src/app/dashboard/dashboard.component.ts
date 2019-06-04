import { Component, OnInit } from '@angular/core';
import { DBApiService } from '../services/dbapi.service';
import { StatsService } from '../services/stats.service';
import { OrdersService } from '../services/orders.service';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs'
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  orders;
  stats;
  searchForm;
  searchMessageDisplay = 'd-none';

  constructor(
    private dbapi : DBApiService,
    private statsService : StatsService,
    private ordersService : OrdersService,
    private loginService : LoginService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { 
    if (!this.loginService.isLoggedIn()) {
      router.navigate(['/']);
      return;
    }
    this.orders = this.ordersService.getOrders();
    this.stats = this.statsService.getStats();
    this.searchForm = this.formBuilder.group({
      orderId: ''
    });

    timer(0, 60000).subscribe(() => this.refreshData());
  }

  ngOnInit() {
  }

  refreshData() {
    this.dbapi.fetchOrders(() => {
      this.orders = this.ordersService.getOrders();
    });
    this.dbapi.fetchStats(() => {
      this.stats = this.statsService.getStats();
    });
  }

  onSubmit(searchData) {
    // Process checkout data here
    let orderId = searchData.orderId;
    this.searchMessageDisplay = 'd-none';
    const foundOrder = this.ordersService.find(orderId);
    if (foundOrder) {
      this.router.navigate(['/orders', orderId]);
    } else {
      this.searchMessageDisplay = 'd-inline';
    }
  }

}