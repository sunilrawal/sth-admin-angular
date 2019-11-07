import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StatsService } from '../services/stats.service';

@Injectable({
  providedIn: 'root'
})

export class DBApiService {

  orders = [];
  since : Date;
  lastCheckOrdersSTH: Date;
  lastCheckStatsSTH: Date;
  lastCheckOrdersStore: Date;
  lastCheckStatsStore: Date;

  constructor(
    private http: HttpClient,
    private statsService : StatsService,
  ) { 
    this.lastCheckOrdersSTH = new Date(2019, 1, 1);
    this.lastCheckOrdersStore = new Date(2019, 1, 1);
    this.lastCheckStatsSTH = new Date(2019, 1, 1);
    this.lastCheckStatsStore = new Date(2019, 1, 1);
  }

  private headerDict() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': '5OXiKzjasT9IkuM6e4biI29SPT4ONc264qZw0Ult',
    };
  }

  fetchOrders(source, callback) {
    const dt = source === 'sth' ? this.lastCheckOrdersSTH : this.lastCheckOrdersStore;
    if ((new Date()).getTime() - dt.getTime() < 60000) {
      callback();
      return;
    }

    if (source === 'sth') { 
      this.lastCheckOrdersSTH = new Date();
    } else {
      this.lastCheckOrdersStore = new Date();
    }

    const requestOptions = {                                                                
      headers: new HttpHeaders(this.headerDict()), 
    };

    const tableName = source === 'store' ? 'photoorders' : 'sthorders';
    let url = `https://api.jpeglabs.com/v1/photo-orders?tableName=${tableName}&q=orders&`;
    if (this.since) url += `since=${this.since.toISOString()}`;

    this.http.get(url, requestOptions).subscribe(
      data => {
        this.since = new Date();
        if (!data['results']) console.log(data);
        callback(data['results']);
      },
      error => {
        console.log(error);
        callback([]);
      }
    );
  }

  fetchOrdersByOrderId(source, orderId, callback) {
    const requestOptions = {                                                                
      headers: new HttpHeaders(this.headerDict()), 
    };

    const tableName = source === 'store' ? 'photoorders' : 'sthorders';
    let url = `https://api.jpeglabs.com/v1/photo-orders?tableName=${tableName}&q=orders&orderId=${orderId}`;
    this.http.get(url, requestOptions).subscribe(
      data => {
        callback(data['results']);
      },
      error => {
        callback([]);
      }
    );
  }

  fetchStats(source, callback) {
    const dt = source === 'sth' ? this.lastCheckStatsSTH : this.lastCheckStatsStore;
    if ((new Date()).getTime() - dt.getTime() < 60000) {
      callback();
      return;
    }

    if (source === 'sth') { 
      this.lastCheckStatsSTH = new Date();
    } else {
      this.lastCheckStatsStore = new Date();
    }

    const requestOptions = {                                                                
      headers: new HttpHeaders(this.headerDict()), 
    };
  
    const tableName = source === 'store' ? 'photoorders' : 'sthorders';
    let url = `https://api.jpeglabs.com/v1/photo-orders?tableName=${tableName}&q=stats`;
    this.http.get(url, requestOptions).subscribe(
      data => {
        this.statsService.setStats(source, data['results']);
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
    let url = `https://api.jpeglabs.com/v1/sth-login?client=STHAdminWeb&&pwd=${pwd}`;
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