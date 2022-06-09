import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerOrderService } from '../customer-order.service';
import { Order } from '../models/order';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  customerName?: string;

  orders: Order[] | null = [];

  constructor(private customerService: CustomerOrderService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (customerId != null) {
      this.customerService.findOrders(customerId)
        .subscribe(orders => {
          this.orders = orders;
          if (!this.customerName && orders && orders.length > 0) {
            this.customerName = orders[0].customerName;
          }
        });
    }
  }
  onClick() {
    const customerId = Number(this.route.snapshot.paramMap.get('id'));
    if (customerId != null) {
      this.router.navigate([`customers/${customerId}`]);
    }
  }

  onClickHome() {
    this.router.navigate(['/home']);
  }
}
