import { Component, OnInit } from '@angular/core';
import { DBApiService } from '../../services/dbapi.service';
import { StatsService } from '../../services/stats.service';
import { OrdersService } from '../../services/orders.service';
import { LoginService } from '../../services/login.service';
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
    // if (!this.loginService.isLoggedIn()) {
    //   router.navigate(['/']);
    //   return;
    // }
    this.orders = this.ordersService.getOrders('sth');
    this.stats = this.statsService.getStats('sth');
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
    this.dbapi.fetchStats('sth', () => {
      this.stats = this.statsService.getStats('sth');
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