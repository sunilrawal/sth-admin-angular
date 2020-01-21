import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { DBApiService } from '../services/dbapi.service';

@Injectable({
  providedIn: 'root'
})

export class OrdersService {

  sthOrders = [];
  storeOrders = [];
  constructor(
    private dbapi : DBApiService
  ) { }

  setOrders(source, orders) {
    if (!orders) return;
    
    const lookup = this.orderLookup(source);
    const sourceOrders = source === 'sth' ? this.sthOrders : this.storeOrders;
    let ods: Order[] = Array.from(sourceOrders);
    for (let i = 0; i < orders.length; ++i) {
      let o = Order.from(orders[i]);
      if (!lookup[o.order_id])
        ods.push(o);
    }
    ods.sort((a, b) => (a.date < b.date) ? 1 : -1);
    if (source === 'sth') {
      this.sthOrders = ods;
      console.log(`${this.sthOrders.length} STH orders now`);
    } else {
      this.storeOrders = ods;
      console.log(`${this.sthOrders.length} store orders now`);
    }



  }

  setOrder(source, order) {
    const sourceOrders = source === 'sth' ? this.sthOrders : this.storeOrders;
    const lookup = this.orderLookup(source);
    if (lookup[order.order_id]) {
      return;
    }
    let ods: Order[] = Array.from(sourceOrders);
    ods.push(order);
    ods.sort((a, b) => (a.date < b.date) ? 1 : -1);
    if (source === 'sth') {
      this.sthOrders = ods;
    } else {
      this.storeOrders = ods;
    }
  }

  orderLookup(source) {
    const sourceOrders = source === 'sth' ? this.sthOrders : this.storeOrders;
    const lookup = {};
    for (let i = 0; i < sourceOrders.length; ++i) {
      const o = sourceOrders[i];
      lookup[o.order_id] = o;
    }
    return lookup;
  }

  getOrders(source) {
    return source === 'sth' ? this.sthOrders : this.storeOrders;
  }

  find(source, identifier, callback) {
    const sourceOrders = source === 'sth' ? this.sthOrders : this.storeOrders;
    for (let i = 0; i < sourceOrders.length; ++i) {
      if (sourceOrders[i].order_id === identifier) {
        console.log(`Found cached order ${identifier}`);
        callback([sourceOrders[i]]);
        return;
      }
    }

    this.dbapi.fetchOrdersByOrderId(source, identifier, (orders) => {
      if (orders.length == 0) {
        callback([]);
        return;
      }

      const ods = [];
      for (let i = 0; i < orders.length; i += 1) {
        const o = Order.from(orders[i]);
        ods.push(o);
      }
      callback(ods);
    });

  }
}

// SHF-iZYST