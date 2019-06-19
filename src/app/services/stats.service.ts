import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class StatsService {

  stats = {today: '-', yesterday: '-', sevenDays: '-', allTime: '-', aov7: '-', mtd: '-'};

  constructor() { }

  setStats(stats) {
    var keys = Object.keys(stats);
    var aov7 = stats['aov7'];
    for (let i = 0; i < keys.length; ++i) {
      let key = keys[i];
      this.stats[key] = `$${parseInt(stats[key]).toLocaleString()}`;
    }
    this.stats['aov7'] = `$${parseFloat(aov7).toFixed(2)}`;
  }

  getStats() {
    return this.stats;
  }
}