import { Component, OnInit } from '@angular/core';
import { StatsService } from 'src/app/services/stats.service';
import { midnightToday, dateToStatsString }  from '../../utils/date_utils';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
	selector: 'dashboard',
	templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

  stats;
  salesResults;
  countResults;
  profitResults;
  ready = false;

  // graphs
  view: any[] = [500, 260];
  showLabels: boolean = true;
  animations: boolean = true;
  yAxisLabels = { sales: 'sales ($)', counts: 'orders', profits: 'profit'};
  legendPosition = 'below';
  colorScheme = {
    domain: ['#E44D25', '#5AA454', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(
    private statsService : StatsService,
    private loginService : LoginService,
    private router: Router,
  ) {
    if (!this.loginService.isLoggedIn()) {
      router.navigate(['/']);
      return;
    } 
    this.initializeStats();
  }
    
  ngOnInit() {
    this.statsService.subscribe('all', this);
    this.statsService.start();
  }
  
  initializeStats() {
    this.salesResults = { cvs:[], fast:[], ez:[] };
    this.countResults = { cvs:[], fast:[], ez:[] };
    this.profitResults = { cvs:[], fast:[], ez:[] };
    const sts = this.statsService.getStats('all');

    if (sts && sts.length > 0) {
      this.ready = true;
      this.statsCallback(sts);
      return;
    }

    const days = [];
    let mt7before = midnightToday();
    mt7before.setDate(mt7before.getDate() - 7);
    for (let i = 0; i < 7; i += 1) {
      let dt = new Date(mt7before);
      dt.setDate(dt.getDate() + i);
      const d = dateToStatsString(dt);
      days.push({ name: d, value: 0 });
    }
    const apps = ['ez', 'fast', 'cvs'];
    const res = [ days, days, days ];
    for (let i = 0; i < apps.length; i += 1) {
      const app = apps[i];
      this.salesResults[app] = res;
      this.countResults[app] = res;
      this.profitResults[app] = res;
    }
  }

  statsCallback(sts) {
    console.log(`statsCallback for dashboard.all`);
    this.stats = this.statsService.getStats('all');
    const apps = ['ez', 'fast', 'cvs'];
    for (let i = 0; i < apps.length; i += 1) {
      const app = apps[i];
      this.salesResults[app] = this.setupGraph(app, 'OrderAmountDay', false);
      this.countResults[app] = this.setupGraph(app, 'OrderCountDay', false);
      this.profitResults[app] = this.setupGraph(app, 'OrderAmountDay', true);
    }
    this.ready = true;
  }

  setupGraph(app, key, profit) {
    
    const totalSeries = [];
    const storeSeries = [];
    const sthSeries = [];

    const stores = {};
    const sths = {};
    for (let i = 0; i < this.stats.length; i += 1) {
      const ds = this.stats[i];
      stores[ds.start_day] = 0
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
      if (ds.app_name === app_name && ds.key === key && ds.source === 'photoorders') {
        const multiplier = profit ? (app==='cvs'?0.15:0.225) : 1.0;
        stores[ds.start_day] = multiplier*ds.value;
      }

      if (ds.app_name === app_name && ds.key === key && ds.source === 'sthorders') {
        const multiplier = profit ? 0.48 : 1.0;
        sths[ds.start_day] = multiplier*ds.value;
      }
    }

    const days = Object.keys(stores).sort();
    for (let i = 0; i < days.length; i += 1) {
      const dayInfo = days[i].split('-');
      const day = `${dayInfo[1]}/${dayInfo[2]}`;
      const store = stores[days[i]]
      const sth = sths[days[i]];
      const total = store + sth;
      const storePercent = (100*store/total).toFixed(0);
      const sthPercent = (100*sth/total).toFixed(0);
      totalSeries.push({ name: day, value: total.toFixed(0), percent: '100' });
      storeSeries.push({ name: day, value: store.toFixed(0), percent: storePercent });
      sthSeries.push({ name: day, value: sth.toFixed(0), percent: sthPercent });
    }

    return [
      { name: 'Total', series: totalSeries },
      { name: 'Store', series: storeSeries },
      { name: 'STH', series: sthSeries }
    ];

  }

}