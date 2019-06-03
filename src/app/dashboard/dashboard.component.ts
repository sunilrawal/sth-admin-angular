import { Component, OnInit } from '@angular/core';
import { DBApiService } from '../services/dbapi.service';
import { StatsService } from '../services/stats.service';
import { OrdersService } from '../services/orders.service';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  orders;
  stats;

  constructor(
    private dbapi : DBApiService,
    private statsService : StatsService,
    private ordersService : OrdersService,
    private loginService : LoginService,
    private router: Router,
  ) { 
    router.navigate(['/']);
    this.orders = this.ordersService.getOrders();
    this.stats = this.statsService.getStats();
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
}