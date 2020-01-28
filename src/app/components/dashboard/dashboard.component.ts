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
  totalResults;
  profitSTHResults;
  profitStoreResults;
  todaySales;
  ready = false;
  todaySTHReady = false;
  todayStoreReady = false;

  // graphs
  view: any[] = [500, 260];
  view2: any[] = [500, 320];
  showLabels: boolean = true;
  animations: boolean = true;
  yAxisLabels = { sales: 'sales ($)', counts: 'orders', profits: 'profit ($)'};
  legendPosition = 'below';
  colorScheme = {
    domain: ['#f00', '#bbb', '#033', '#033']
  };
  colorScheme2 = {
    domain: ['#f00', '#033', '#033']
  };
  colorScheme3 = {
    domain: ['#03a']
  };
  colorScheme4 = {
    domain: ['#f00', '#aaa']
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
    this.statsService.subscribe('today_sales', this);
    this.statsService.start();
  }
  
  initializeStats() {
    this.salesResults = { cvs:[], fast:[], ez:[] };
    this.countResults = { cvs:[], fast:[], ez:[] };
    this.profitResults = { cvs:[], fast:[], ez:[] };
    this.totalResults = { store:[], sth:[], total:[] };
    this.todaySales = { sth: [], store: [] };

    const sts = this.statsService.getStats('all');

    if (sts && sts.length > 0) {
      this.ready = true;
      this.statsCallback('all', 'daily_stats', sts);
      return;
    }

    const days = this.generateDays(7);
    const ds = [];
    for (let i = 0; i < days.length; i += 1) {
      const dayInfo = days[i].split('-');
      const day = `${dayInfo[1]}/${dayInfo[2]}`;
      ds.push({ name: day, value: 10 });
    }
    const apps = ['ez', 'fast', 'cvs'];
    const res = [ ds, ds, ds ];
    for (let i = 0; i < apps.length; i += 1) {
      const app = apps[i];
      this.salesResults[app] = res;
      this.countResults[app] = res;
      this.profitResults[app] = res;
    }

    this.totalResults = [res, res, res];
    this.profitSTHResults = ds;
    this.profitStoreResults = ds;
  }

  generateDays(num) {
    const days = [];
    let mt7before = midnightToday();
    mt7before.setDate(mt7before.getDate() - 7);
    for (let i = 0; i < num; i += 1) {
      let dt = new Date(mt7before);
      dt.setDate(dt.getDate() + i);
      const d = dateToStatsString(dt);
      days.push(d);
    }
    return days;
  }

  statsCallback(source, tableName, sts) {
    if (source === 'all') this.allStatsCallback(sts);
    if (source === 'today_sales') this.todaySalesStatsCallback(tableName, sts);
  }

  // data is {today: [orders], last_week: [orders]}
  // arrange into hours and make the graph
  todaySalesStatsCallback(tableName, sts) {

    console.log(`todaySalesStatsCallback ${tableName}`);
    const todaySeries = this.calculateHourTotals(sts.today, true);
    const todayData = {name: 'Today', series: todaySeries};

    const lastWeekSeries = this.calculateHourTotals(sts.last_week, false);
    const lastWeekData = {name: 'Last week', series: lastWeekSeries};

    const key = tableName === 'sthorders' ? 'sth' : 'store';
    this.todaySales[key] = [todayData, lastWeekData];
    if (tableName === 'sthorders') this.todaySTHReady = true;
    else this.todayStoreReady = true;
  }

  calculateHourTotals(dayOrders, isToday) {
    const series = [];
    const orders = {};
    for (let i = 0; i < dayOrders.length; i += 1) {
      const order = dayOrders[i];
      const dts = new Date(order.date).toLocaleString().split(' ');
      const hr = dts[1].split(':')[0] + dts[2];
      if (!(hr in orders)) orders[hr] = [];
      orders[hr].push(order);
    }
    let ampm = 'AM';
    let cumTotal = 0;
    let orderCount = 0;
    const nows = new Date().toLocaleString().split(' ');
    const now = nows[1].split(':')[0] + nows[2];
    for (let h = 0; h < 24; h += 1) {
      let hr = (h === 0 || h === 12) ? 12 : h%12;
      if (h === 12) ampm = 'PM';
      let key = `${hr}${ampm}`;
      const ods = orders[key];
      const len = ods ? ods.length : 0;
      for (let i = 0; i < len; i += 1) {
        const o = ods[i];
        if (isToday) console.log(key + ' ' + new Date(o.date).toLocaleString());
        cumTotal += o.amount;
      }

      series.push({ name:key, value: cumTotal.toFixed(0) });

      orderCount += len;
      if (key === now && isToday) break;
    }
    return series;
  }

  allStatsCallback(sts) {
    console.log(`statsCallback for dashboard.all`);
    this.stats = this.statsService.getStats('all');
    const apps = ['ez', 'fast', 'cvs'];
    for (let i = 0; i < apps.length; i += 1) {
      const app = apps[i];
      this.salesResults[app] = this.setupGraph(app, 'OrderAmountDay', false);
      this.countResults[app] = this.setupGraph(app, 'OrderCountDay', false);
      this.profitResults[app] = this.setupGraph(app, 'OrderAmountDay', true);
    }
    this.totalResults = this.setupTotals('OrderAmountDay');
    const profitSeries = [];
    const shPtr = this.totalResults[1].series;
    for (let i = 0; i < shPtr.length; i += 1) {
      const pt = shPtr[i];
      const val = pt.value * 0.48;
      profitSeries.push({ name: pt.name, value: val });
    }
    this.profitSTHResults = profitSeries;

    const storeSeries = [];
    const days = this.generateDays(7);
    for (let i = 0; i < days.length; i += 1) {
      const dayInfo = days[i].split('-');
      const day = `${dayInfo[1]}/${dayInfo[2]}`;
      storeSeries.push({ name:day, value:0 });
    }
    for (let i = 0; i < apps.length; i += 1) {
      const app = apps[i];
      const series = this.profitResults[app][2].series;
      for (let j = 0; j < series.length; j += 1) {
        storeSeries[j].value += parseInt(series[j].value);
      }
    }
    this.profitStoreResults = storeSeries;
    this.ready = true;
  }

  setupTotals(key) {
    const seriesStore = [];
    const seriesSTH = [];
    const seriesTotal = [];
    const totalsStore = {};
    const totalsSTH = {};
    const totalsTotal = {};
    for (let i = 0; i < this.stats.length; i += 1) {
      const ds = this.stats[i];
      totalsStore[ds.start_day] = 0;
      totalsSTH[ds.start_day] = 0;
      totalsTotal[ds.start_day] = 0;
    }
    for (let i = 0; i < this.stats.length; i += 1) {
      const ds = this.stats[i];
      if (ds.key != key) continue;

      if (ds.source === 'photoorders') {
        totalsStore[ds.start_day] += ds.value;
      }
      if (ds.source === 'sthorders') {
        totalsSTH[ds.start_day] += ds.value;
      }
      totalsTotal[ds.start_day] += ds.value;
    }

    const days = this.generateDays(14).sort();
    for (let i = 0; i < 7; i += 1) {
      const dayInfo = days[i].split('-');
      const day = `${dayInfo[1]}/${dayInfo[2]}`;
      const totalSTH = totalsSTH[days[i]];
      const totalStore = totalsStore[days[i]];
      const total = totalSTH + totalStore;

      const sthPercent = `(${ (100*totalSTH/total).toFixed(0) }%)`;
      seriesSTH.push({ name: day, value: totalSTH.toFixed(0), percent: sthPercent });

      const storePercent = `(${ (100*totalStore/total).toFixed(0) }%)`;
      seriesStore.push({ name: day, value: totalStore.toFixed(0), percent: storePercent });

      const totalTotal = totalsTotal[days[i]];
      seriesTotal.push({ name: day, value: totalTotal.toFixed(0), percent: '' });
    }

    return [
      { name: 'Total', series: seriesTotal },
      { name: 'STH', series: seriesSTH },
      { name: 'Store', series: seriesStore }
    ];
  }

  setupGraph(app, key, profit) {
    
    const totalSeries = [];
    const storeSeries = [];
    const sthSeries = [];
    const total7Series = [];

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

    const days = this.generateDays(14).sort();
    for (let i = 0; i < 7; i += 1) {
      const dayInfo = days[i].split('-');

      const date7Before = new Date(days[i]);
      date7Before.setDate(date7Before.getDate()-7);
      const day7Before = date7Before.toISOString().split('T')[0];

      const day = `${dayInfo[1]}/${dayInfo[2]}`;
      const store = stores[days[i]]
      const sth = sths[days[i]];
      const total = store + sth;
      const storePercent = (100*store/total).toFixed(0);
      const sthPercent = (100*sth/total).toFixed(0);
      storeSeries.push({ name: day, value: store.toFixed(0), percent: '('+storePercent+'%)' });
      sthSeries.push({ name: day, value: sth.toFixed(0), percent: '('+sthPercent+'%)' });

      const store7 = stores[day7Before]
      const sth7 = sths[day7Before];
      const total7 = store7 + sth7;
      const percent7 = (100*(total7-total)/total);
      total7Series.push({ name: day, value: total7.toFixed(0) });

      const tPercent = -percent7;
      const pm = tPercent >= 0 ? '+' : '';
      totalSeries.push({ name: day, value: total.toFixed(0), percent: '('+pm+tPercent.toFixed(0)+'%)' });
    }

    return [
      { name: 'Total', series: totalSeries },
      { name: 'Last week', series: total7Series },
      { name: 'Store', series: storeSeries },
      { name: 'STH', series: sthSeries }
    ];

  }


  setupStackedGraph(app, key, profit) {
    
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
    const allData = [];

    for (let i = 0; i < days.length; i += 1) {
      const dayInfo = days[i].split('-');
      const day = `${dayInfo[1]}/${dayInfo[2]}`;
      const store = stores[days[i]]
      const sth = sths[days[i]];
      const total = store + sth;
      const storePercent = (100*store/total).toFixed(0);
      const sthPercent = (100*sth/total).toFixed(0);
      
      const series = [];
      series.push({ name: 'STH', value: sth });
      series.push({ name: 'Store', value: store });
      //series.push({ name: 'Total', value: total.toFixed(0), percent: '100' });

      allData.push({ name: day, series });
    }
    return allData;

  }

}