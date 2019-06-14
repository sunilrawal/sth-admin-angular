import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  order;

  constructor(
    private route: ActivatedRoute,
    private ordersService : OrdersService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let orderId = params.get('orderId');
      this.ordersService.find(orderId, (order) => {
        this.order = order;
      });
    });
  }

}