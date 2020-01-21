import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DBApiService {

  orders = [];
  since : Date;
  lastCheckOrders: any;
  lastCheckStats: any;

  constructor(
    private http: HttpClient,
  ) { 
    const dt = new Date(2019, 1, 1);
    this.lastCheckOrders = {sth: dt, walgreens: dt, cvs: dt};
    this.lastCheckStats = {sth: dt, walgreens: dt, cvs: dt, all: dt};
  }

  private headerDict() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': '5OXiKzjasT9IkuM6e4biI29SPT4ONc264qZw0Ult',
    };
  }

  baseUrl() {
    return 'https://apidev.jpeglabs.com/v1';
  }
  
  fetchOrders(source, callback) {
    const dt = this.lastCheckOrders[source];
    if ((new Date()).getTime() - dt.getTime() < 300000) {
      callback();
      return;
    }

    this.lastCheckOrders[source] = new Date();

    const requestOptions = {                                                                
      headers: new HttpHeaders(this.headerDict()), 
    };

    const tableName = source === 'sth' ? 'sthorders' : 'photoorders';
    let url = `${this.baseUrl()}/photo-orders?tableName=${tableName}&q=orders&`;
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

  fetchOrdersByOrderId(source, identifier, callback) {
    const requestOptions = {                                                                
      headers: new HttpHeaders(this.headerDict()), 
    };

    const tableName = source === 'sth' ? 'sthorders' : 'photoorders';
    let url = `${this.baseUrl()}/photo-orders?tableName=${tableName}&q=orders&identifier=${identifier}`;
    console.log(url);
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
    const dt = this.lastCheckStats[source];
    if ((new Date()).getTime() - dt.getTime() < 300000) {
      callback({});
      return;
    }

    this.lastCheckStats[source] = new Date();

    const requestOptions = {                                                                
      headers: new HttpHeaders(this.headerDict()), 
    };
    let tableName = source === 'sth' ? 'sthorders' : 'photoorders';
    if (source === 'all') tableName = 'daily_stats';

    let url = `${this.baseUrl()}/photo-orders?tableName=${tableName}&source=${source}&q=stats`;
    console.log(`Fetch stats: ${url}`);
    this.http.get(url, requestOptions).subscribe(
      data => {
        callback(data['results']);
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
    let url = `${this.baseUrl()}/sth-login?client=STHAdminWeb&&pwd=${pwd}`;
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