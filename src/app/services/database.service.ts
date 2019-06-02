import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  orders = [];
  since : Date;

  constructor(
    private http: HttpClient
  ) { 
  }

  getOrders() {
    return this.orders;
  }

  getOrder(orderId) {
    for (let i = 0; i < this.orders.length; ++i) {
      if (this.orders[i].order_id == orderId)
        return this.orders[i];
    }
    return undefined;
  }

  private headerDict() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': 'InuEZx7NXy6u6L2Wq5tye82j8hVQU9Ml8fp6wpxe',
    };
  }

  fetchOrders(callback) {
    const requestOptions = {                                                                
      headers: new HttpHeaders(this.headerDict()), 
    };

    let url = 'https://apidev.jpeglabs.com/v1/sth-orders';
    if (this.since) url = `${url}?since=${this.since.toISOString()}`;
    console.log(url);

    this.http.get(url, requestOptions).subscribe(
      data => {
        let ods: Order[] = Array.from(this.orders);
        for (let i = 0; i < data.results.length; ++i) {
          let o = Order.from(data.results[i]);
          ods.push(o);
        }
        ods.sort((a, b) => (a.date < b.date) ? 1 : -1);
        this.orders = ods;
        callback(this.orders);
      },
      error => {
        console.log(error);
        callback([]);
      }
    );
  }

  fetchStats(callback) {
    const requestOptions = {                                                                
      headers: new HttpHeaders(this.headerDict()), 
    };
    let url = 'https://apidev.jpeglabs.com/v1/sth-stats';
    this.http.get(url, requestOptions).subscribe(
      data => {
        callback(data.results);
        this.since = new Date();
      },
      error => {
        console.log(error);
        callback({});
      }
    );
  }

}