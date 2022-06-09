import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerOrderService } from '../customer-order.service';
import { Customer } from '../models/customer';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {

  constructor(private customerService: CustomerOrderService, private route: ActivatedRoute, private router: Router) { }

  customer: Customer | null = null;

  ngOnInit(): void {
    this.loadCustomer();
  }

  loadCustomer() {
    const id: string = this.route.snapshot.paramMap.get('id') as string;
    console.log(id);
    this.customerService.findCustomer(id)
      .subscribe(customer => this.customer = customer);
  }

  onClick() {
    if (this.customer != null) {
      this.router.navigate([`/customers/${this.customer.id}/orders`]);
    }
  }

  onClickHome() {
    this.router.navigate(['/home']);
  }
}
