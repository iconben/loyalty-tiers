import { Component, OnInit } from '@angular/core';
import { CustomerOrderService } from '../customer-order.service';
import { Customer } from '../models/customer';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {

  constructor(private customerService: CustomerOrderService) { }

  customer: Customer | null = null;

  ngOnInit(): void {
    this.loadCustomer(131);
  }

  loadCustomer(id: number) {
    this.customerService.findCustomer(id)
      .subscribe(customer => this.customer = customer);
  }

}
