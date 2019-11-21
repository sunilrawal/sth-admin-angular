import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class StatsService {

  statsSTH = {salesToday: '-', salesYesterday: '-', salesSevenDays: '-', salesAllTime: '-', aov7: '-', salesMtd: '-',
  ordersToday: '-', customersToday: '-', repeats7: '-', productStats: '-', appCounts: '-'};

  statsStore = {salesToday: '-', salesYesterday: '-', salesSevenDays: '-', salesAllTime: '-', aov7: '-', salesMtd: '-',
  ordersToday: '-', customersToday: '-', repeats7: '-', productStats: '-', appCounts: '-'};

  constructor() { }

  setStats(source, stats) {
    var keys = Object.keys(stats);

    console.log(stats);
    var sts = source === 'sth' ? this.statsSTH : this.statsStore;
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
      ret.push(`${a.app}: ${a.percent.toFixed(0)}%`);
    }
    return ret.join(' / ');
  }

  parseProductStats(pStats) {
    return `${pStats['Prints']} / ${pStats['Posters']} / ${pStats['Canvas']}`;
  }
  getStats(source) {
    return source === 'sth' ? this.statsSTH : this.statsStore;
  }
}