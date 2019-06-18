import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StatsService } from '../services/stats.service';

@Injectable({
  providedIn: 'root'
})

export class DBApiService {

  orders = [];
  since : Date;
  lastCheckOrders: Date;
  lastCheckStats: Date;

  constructor(
    private http: HttpClient,
    private statsService : StatsService,
  ) { 
  }

  private headerDict() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': 'InuEZx7NXy6u6L2Wq5tye82j8hVQU9Ml8fp6wpxe',
    };
  }

  fetchOrders(callback) {
    if (this.lastCheckOrders && (new Date()).getTime() - this.lastCheckOrders.getTime() < 60000) {
      callback();
      return;
    }

    this.lastCheckOrders = new Date();

    const requestOptions = {                                                                
      headers: new HttpHeaders(this.headerDict()), 
    };

    let url = 'https://apidev.jpeglabs.com/v1/sth-orders';
    if (this.since) url = `${url}?since=${this.since.toISOString()}`;

    this.http.get(url, requestOptions).subscribe(
      data => {
        this.since = new Date();
        callback(data['results']);
      },
      error => {
        console.log(error);
        callback([]);
      }
    );
  }

  fetchOrder(orderId, callback) {
    const requestOptions = {                                                                
      headers: new HttpHeaders(this.headerDict()), 
    };

    let url = `https://apidev.jpeglabs.com/v1/sth-orders?orderId=${orderId}`;
    this.http.get(url, requestOptions).subscribe(
      data => {
        callback(data['order']);
      },
      error => {
        callback({});
      }
    );
  }

  fetchStats(callback) {
    if (this.lastCheckStats && (new Date()).getTime() - this.lastCheckStats.getTime() < 60000) {
      callback();
      return;
    }
    this.lastCheckStats = new Date();

    const requestOptions = {                                                                
      headers: new HttpHeaders(this.headerDict()), 
    };
    let url = 'https://apidev.jpeglabs.com/v1/sth-stats';
    this.http.get(url, requestOptions).subscribe(
      data => {
        console.log(data);
        this.statsService.setStats(data['results']);
        callback();
      },
      error => {
        console.log(error);
        callback({});
      }
    );
  };

  fetchLogin(pwd, callback) {
    const requestOptions = {                                                                
      headers: new HttpHeaders(this.headerDict()), 
    };
    let url = `https://apidev.jpeglabs.com/v1/sth-login?client=STHAdminWeb&&pwd=${pwd}`;
    this.http.get(url, requestOptions).subscribe(
      data => {
        const ok = data['status'] === 'ok';
        callback(ok);
      },
      error => {
        console.log(error);
        callback(false);
      }
    );
  }
}