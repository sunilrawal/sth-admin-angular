import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class StatsService {

  stats = {today: '-', yesterday: '-', sevenDays: '-', allTime: '-', aov7: '-', mtd: '-'};

  constructor() { }

  setStats(stats) {
    var keys = Object.keys(stats);
    for (let i = 0; i < keys.length; ++i) {
      let key = keys[i];
      this.stats[key] = `$${parseFloat(stats[key]).toLocaleString()}`;
    }
  }

  getStats() {
    return this.stats;
  }
}