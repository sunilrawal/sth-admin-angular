import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { DBApiService } from '../services/dbapi.service';

@Injectable({
  providedIn: 'root'
})

export class OrdersService {

  orders = [];
  constructor(
    private dbapi : DBApiService
  ) { }

  setOrders(orders) {
    const lookup = this.orderLookup();

    let ods: Order[] = Array.from(this.orders);
    for (let i = 0; i < orders.length; ++i) {
      let o = Order.from(orders[i]);
      if (!lookup[o.order_id])
        ods.push(o);
    }
    ods.sort((a, b) => (a.date < b.date) ? 1 : -1);
    this.orders = ods;
  }

  setOrder(order) {
    const lookup = this.orderLookup();
    if (lookup[order.order_id]) {
      return;
    }
    let ods: Order[] = Array.from(this.orders);
    ods.push(order);
    ods.sort((a, b) => (a.date < b.date) ? 1 : -1);
    this.orders = ods;
  }

  orderLookup() {
    const lookup = {};
    for (let i = 0; i < this.orders.length; ++i) {
      const o = this.orders[i];
      lookup[o.order_id] = o;
    }
    return lookup;
  }

  getOrders() {
    return this.orders;
  }

  find(orderId, callback) {
    for (let i = 0; i < this.orders.length; ++i) {
      if (this.orders[i].order_id === orderId) {
        callback(this.orders[i]);
        return;
      }
    }

    this.dbapi.fetchOrder(orderId, (order) => {
      const o = Order.from(order);
      this.setOrder(o);
      callback(o);
    });

  }
}