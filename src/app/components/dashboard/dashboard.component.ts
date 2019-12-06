import { Component, OnInit, Input } from '@angular/core';
import { DBApiService } from '../../services/dbapi.service';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  stats;

  @Input() source: string;

  constructor(
    private dbapi : DBApiService,
    private statsService : StatsService,
  ) {
  }

  ngOnInit() {
    this.stats = this.statsService.getStats(this.source);
    this.statsService.subscribe(this.source, this);
  }

  statsCallback(sts) {
    console.log(`statsCallback for dashboard.${this.source}`);
    this.stats = sts;
  }

}