import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class StatsService {

  stats = {salesToday: '-', salesYesterday: '-', salesSevenDays: '-', salesAllTime: '-', aov7: '-', salesMtd: '-',
  ordersToday: '-', customersToday: '-', repeats7: '-'};

  constructor() { }

  setStats(stats) {
    var keys = Object.keys(stats);
    for (let i = 0; i < keys.length; ++i) {
      let key = keys[i];
      if (key.startsWith('sales')) {
        this.stats[key] = `$${parseInt(stats[key]).toLocaleString()}`;
      } else {
        this.stats[key] = stats[key];
      }
    }
    this.stats['aov7'] = `$${parseFloat(stats['aov7']).toFixed(2)}`;
  }

  getStats() {
    return this.stats;
  }
}