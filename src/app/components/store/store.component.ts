import { Component, OnInit } from '@angular/core';
import { DBApiService } from '../../services/dbapi.service';
import { StatsService } from '../../services/stats.service';
import { OrdersService } from '../../services/orders.service';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs'
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {

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
    this.orders = this.ordersService.getOrders('store');
    this.stats = this.statsService.getStats('store');
    this.searchForm = this.formBuilder.group({
      orderId: ''
    });

    timer(0, 60000).subscribe(() => this.refreshData());
  }

  ngOnInit() {
  }

  refreshData() {
    this.dbapi.fetchStats('store', () => {
      this.stats = this.statsService.getStats('store');
    });
  }


}