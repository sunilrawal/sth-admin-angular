import { Injectable } from '@angular/core';
import { timer } from 'rxjs'
import { DBApiService } from './dbapi.service';

@Injectable({
  providedIn: 'root'
})

export class StatsService {

  stats = {
    'sth': {salesToday: '-', salesYesterday: '-', sales7: '-', salesAllTime: '-', aov7: '-', salesMtd: '-',
    ordersToday: '-', customersToday: '-', repeats7: '-', productStats: '-', appCounts: '-'},
    'walgreens': {salesToday: '-', salesYesterday: '-', sales7: '-', salesAllTime: '-', aov7: '-', salesMtd: '-',
    ordersToday: '-', customersToday: '-', repeats7: '-', productStats: '-', appCounts: '-'},
    'cvs': {salesToday: '-', salesYesterday: '-', sales7: '-', salesAllTime: '-', aov7: '-', salesMtd: '-',
    ordersToday: '-', customersToday: '-', repeats7: '-', productStats: '-', appCounts: '-'},
    'all': {},
    'today_sales': {}
  };

  receivers = {};

  constructor(
    private dbapi : DBApiService
  ) {
      
   }

  start() {
    timer(0, 300000).subscribe(() => this.refreshData());
   }

  subscribe(source, rx) {
    this.receivers[source] = rx;
   }

  async refreshData() {
    await this.fetchStats('stats', 'walgreens', 'photoorders');
    await this.fetchStats('stats', 'cvs', 'photoorders');
    await this.fetchStats('stats', 'sth', 'sthorders');
    await this.fetchStats('stats', 'all', 'daily_stats');
    await this.fetchStats('today_sales', 'today_sales', 'sthorders');
    await this.fetchStats('today_sales', 'today_sales', 'photoorders');
  }

  async fetchStats(q, source, tableName) {
    console.log(`Fetching stats for ${q}/${source}/${tableName}`);
    return new Promise((resolve) => {
      this.dbapi.fetchStats(q, source, tableName, (stats) => {
        if (!stats || Object.keys(stats).length == 0) { 
          //console.log(`Empty response for ${q}/${source}/${tableName}. Ignoring`);
          resolve();
          return;
        }

        console.log(`--success for ${q}/${source}/${tableName}`);
        if (source === 'all') this.setDailyStats(stats);
        else if (q === 'today_sales') this.setTodaySales(stats);
        else this.setStats(source, stats);
        const rx = this.receivers[source];
        if (rx) {
          const parsedStats = this.getStats(source);
          rx.statsCallback(source, tableName, parsedStats);
        }
        resolve();
      });
    });
  }

  // take stats from the server and convert them into viewable numbers
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
    sts['repeats7'] = (100*parseFloat(stats['repeats7']) / parseFloat(stats['orders7'])).toFixed(0) + '%';
  }

  setDailyStats(stats) {
    stats.sort((a, b) => b.start_day < a.start_day ? -1 : b.start_day === a.start_day ? 0 : 1)
    this.stats['all'] = stats;
  }

  setTodaySales(stats) {
    this.stats['today_sales'] = stats;
  }

  parseAppCounts(counts) {
    if (!counts) return '';
    let total = 0;
    const apps = Object.keys(counts);
    const arry = [];
    const appNameMap = {'com.jpeglabs.printmatic.cvs.ios':'CVS', 'com.jpeglabs.Print-Photos-Walgreens-Printing-Photos-COSTCO':'Fast', 
      'com.jpeglabs.Photo-Prints-Walgreens-Printing-Photos-CVS':'EZ', 'com.jpeglabs.printasa.ios':'Printasa'};
    for (let i = 0; i < apps.length; i += 1) {
      const count = parseInt(counts[apps[i]]);
      total += count;
    }

    for (let i = 0; i < apps.length; i += 1) {
      const app = appNameMap[apps[i]];
      const count = parseInt(counts[apps[i]]);
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