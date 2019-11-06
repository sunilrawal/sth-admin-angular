import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class StatsService {

  statsSTH = {salesToday: '-', salesYesterday: '-', salesSevenDays: '-', salesAllTime: '-', aov7: '-', salesMtd: '-',
  ordersToday: '-', customersToday: '-', repeats7: '-', productStats: '-'};

  statsStore = {salesToday: '-', salesYesterday: '-', salesSevenDays: '-', salesAllTime: '-', aov7: '-', salesMtd: '-',
  ordersToday: '-', customersToday: '-', repeats7: '-', productStats: '-'};

  constructor() { }

  setStats(source, stats) {
    var keys = Object.keys(stats);

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

  }

  parseProductStats(pStats) {
    return `${pStats['Prints']} / ${pStats['Posters']} / ${pStats['Canvas']}`;
  }
  getStats(source) {
    return source === 'sth' ? this.statsSTH : this.statsStore;
  }
}