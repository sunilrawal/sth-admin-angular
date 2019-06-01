import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  order;

  constructor(
    private route: ActivatedRoute,
    private db : DatabaseService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let orderId = params.get('orderId');
      this.order = this.db.getOrder(orderId);
    });
  }

}