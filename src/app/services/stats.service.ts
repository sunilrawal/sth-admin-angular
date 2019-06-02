import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class StatsService {

  stats = {today: '-', yesterday: '-', sevenDays: '-', allTime: '-', aov7: '-'};

  constructor() { }

  setStats(stats) {
    var keys = Object.keys(stats);
    for (let i = 0; i < keys.length; ++i) {
      let key = keys[i];
      this.stats[key] = `$${stats[key].toFixed(2)}`;
    }
  }

  getStats() {
    return this.stats;
  }
}