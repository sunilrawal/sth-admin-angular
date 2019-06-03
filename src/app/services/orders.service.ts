import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})

export class OrdersService {

  orders = [];
  constructor() { }

  setOrders(orders) {
    const lookup = {};
    for (let i = 0; i < this.orders.length; ++i) {
      const o = this.orders[i];
      lookup[o.order_id] = o;
    }

    let ods: Order[] = Array.from(this.orders);
    for (let i = 0; i < orders.length; ++i) {
      let o = Order.from(orders[i]);
      if (!lookup[o.order_id])
        ods.push(o);
    }
    ods.sort((a, b) => (a.date < b.date) ? 1 : -1);
    this.orders = ods;
  }

  getOrders() {
    return this.orders;
  }

  getOrder(orderId) {
    for (let i = 0; i < this.orders.length; ++i) {
      if (this.orders[i].order_id === orderId)
        return this.orders[i];
    }
    return undefined;
  }
}