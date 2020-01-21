import { Component, OnInit, Input } from '@angular/core';
import { DBApiService } from '../../services/dbapi.service';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-statspanel',
  templateUrl: './statspanel.component.html',
  styleUrls: ['./statspanel.component.css']
})

export class StatspanelComponent implements OnInit {

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
    console.log(`statsCallback for statspanel.${this.source}`);
    this.stats = sts;
  }

}