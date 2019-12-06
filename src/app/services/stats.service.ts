import { Injectable } from '@angular/core';
import { timer } from 'rxjs'
import { DBApiService } from './dbapi.service';

@Injectable({
  providedIn: 'root'
})

export class StatsService {

  stats = {
    'sth': {salesToday: '-', salesYesterday: '-', salesSevenDays: '-', salesAllTime: '-', aov7: '-', salesMtd: '-',
    ordersToday: '-', customersToday: '-', repeats7: '-', productStats: '-', appCounts: '-'},
    'walgreens': {salesToday: '-', salesYesterday: '-', salesSevenDays: '-', salesAllTime: '-', aov7: '-', salesMtd: '-',
    ordersToday: '-', customersToday: '-', repeats7: '-', productStats: '-', appCounts: '-'},
    'cvs': {salesToday: '-', salesYesterday: '-', salesSevenDays: '-', salesAllTime: '-', aov7: '-', salesMtd: '-',
    ordersToday: '-', customersToday: '-', repeats7: '-', productStats: '-', appCounts: '-'},
  };

  receivers = {};

  constructor(
    private dbapi : DBApiService
  ) {
      
   }

  start() {
    timer(0, 60000).subscribe(() => this.refreshData());
   }

  subscribe(source, rx) {
    this.receivers[source] = rx;
   }

  refreshData() {
    this.fetchStats('sth');
    this.fetchStats('walgreens');
    this.fetchStats('cvs');
  }

  fetchStats(source) {
    this.dbapi.fetchStats(source, (stats) => {
      console.log(`fetched stats for ${source}`);
      this.setStats(source, stats);
      const rx = this.receivers[source];
      if (rx) rx.statsCallback(this.getStats(source));
    });
  }

  setStats(source, stats) {
    var keys = Object.keys(stats);

    var sts = this.stats[source];
    for (let i = 0; i < keys.length; ++i) {
      let key = keys[i];
      if (key.startsWith('sales')) {
        sts[key] = `$${parseInt(stats[key]).toLocaleString()}`;
      } else {
        sts[key] = stats[key];
      }
    }
    sts['aov7'] = `$${parseFloat(stats['aov7']).toFixed(2)}`;
    sts['productStats'] = this.parseProductStats(stats.products);
    sts['appCounts'] = this.parseAppCounts(stats['appCounts']);
  }

  parseAppCounts(counts) {
    console.log(counts);
    if (!counts) return '';
    
    let total = 0;
    const apps = Object.keys(counts);
    const arry = [];
    for (let i = 0; i < apps.length; i += 1) {
      const app = apps[i];
      const count = parseInt(counts[app]);
      total += count;
    }

    for (let i = 0; i < apps.length; i += 1) {
      const app = apps[i];
      const count = parseInt(counts[app]);
      const percent = 100*count / total;
      arry.push({app, count, percent});
    }
    arry.sort((a, b) => (a.count < b.count) ? 1 : -1);
    const ret = [];
    for (let i = 0; i < arry.length; i += 1) {
      const a = arry[i];
      if (a.percent < 0.5) continue;
      ret.push(`${a.app}: ${a.percent.toFixed(0)}%`);
    }
    return ret.join(' / ');
  }

  parseProductStats(pStats) {
    if (!pStats) return '0 / 0 / 0';
    const prints = 'Prints' in pStats ? pStats['Prints'] : 0;
    const posters = 'Posters' in pStats ? pStats['Posters'] : 0;
    const canvas = 'Canvas' in pStats ? pStats['Canvas'] : 0;
    return `${prints} / ${posters} / ${canvas}`;
  }

  getStats(source) {
    return this.stats[source];
  }
}