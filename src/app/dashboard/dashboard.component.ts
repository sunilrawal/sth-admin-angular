import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { StatsService } from '../services/stats.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  orders;
  stats;

  constructor(
    private db : DatabaseService,
    private statsService : StatsService
  ) { 
    this.orders = this.db.getOrders();
    this.stats = this.statsService.getStats();
    this.refreshData();
  }

  ngOnInit() {
  }

  refreshData() {
    this.db.fetchOrders(orders => {
      this.orders = this.db.getOrders();
    });
    this.db.fetchStats(stats => {
      this.statsService.setStats(stats);
      this.stats = this.statsService.getStats();
    });
  }
}