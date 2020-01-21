import { Component, OnInit } from '@angular/core';
import { StatsService } from 'src/app/services/stats.service';
import { midnightToday, dateToStatsString }  from '../../utils/date_utils';

@Component({
	selector: 'dashboard',
	templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

  stats;
  salesResults;

  // graphs
  view: any[] = [500, 300];
  showLabels: boolean = true;
  animations: boolean = true;
  xAxisLabels = { sales: 'date'};
  yAxisLabels = { sales: 'sales ($)'};
  legendPosition = 'below';
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(
    private statsService : StatsService
  ) { 
      this.initializeStats();
    }
    
  ngOnInit() { 
    this.statsService.subscribe('all', this);
    this.statsService.start();
  }
  
  initializeStats() {
    this.salesResults = {};
    const days = [];
    let mt7before = midnightToday();
    mt7before.setDate(mt7before.getDate() - 7);
    for (let i = 0; i < 7; i += 1) {
      let dt = new Date(mt7before);
      dt.setDate(dt.getDate() + i);
      const d = dateToStatsString(dt);
      days.push({ name: d, value: 100 });
    }
    this.salesResults['cvs'] = [ days, days ];
  }
  statsCallback(sts) {
    console.log(`statsCallback for dashboard.all`);
    this.stats = sts;
    this.setupGraph('cvs');
    this.setupGraph('fast');
    this.setupGraph('ez');
  }

  setupGraph(app) {
    
    const totalSales = { name: 'Total' };
    const totalSeries = [];
    const sthSales = { name: 'STH' };
    const sthSeries = [];

    const totals = {};
    const sths = {};
    for (let i = 0; i < this.stats.length; i += 1) {
      const ds = this.stats[i];
      totals[ds.start_day] = 0
      sths[ds.start_day] = 0;
    }

    let app_name = '';
    switch (app) {
      case 'cvs': app_name = 'com.jpeglabs.printmatic.cvs.ios'; break; 
      case 'fast': app_name = 'com.jpeglabs.Print-Photos-Walgreens-Printing-Photos-COSTCO'; break; 
      case 'ez': app_name = 'com.jpeglabs.Photo-Prints-Walgreens-Printing-Photos-CVS'; break;
    }
    for (let i = 0; i < this.stats.length; i += 1) {
      const ds = this.stats[i];
      if (ds.app_name === app_name && ds.key === 'OrderAmountDay' && ds.source === 'photoorders') {
        totals[ds.start_day] += ds.value;
      }

      if (ds.app_name === app_name && ds.key === 'OrderAmountDay' && ds.source === 'sthorders') {
        sths[ds.start_day] = ds.value;
        totals[ds.start_day] += ds.value;
      }
    }

    const days = Object.keys(totals).sort();
    for (let i = 0; i < days.length; i += 1) {
      const dayInfo = days[i].split('-');
      const day = `${dayInfo[1]}/${dayInfo[2]}`;
      const total = totals[days[i]];
      const sth = sths[days[i]];
      const percent = (100*sth/total).toFixed(0);
      totalSeries.push({ name: day, value: total.toFixed(0), percent: '100' });
      sthSeries.push({ name: day, value: sth.toFixed(0), percent });
    }
    totalSales['series'] = totalSeries;
    sthSales['series'] = sthSeries;

    this.salesResults[app] = [
      totalSales,
      sthSales,
    ];

  }

}