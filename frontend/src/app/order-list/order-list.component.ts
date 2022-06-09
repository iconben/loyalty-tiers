import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerOrderService } from '../services/customer-order.service';
import { Order } from '../models/order';
import { Page } from '../services/page';
import { Pageable } from '../services/pageable';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, AfterViewInit {

  @ViewChild('firstPage', { static: true})
  firstPage!: ElementRef;

  @ViewChild('previousPage', { static: true})
  previousPage!: ElementRef;

  @ViewChild('nextPage', { static: true})
  nextPage!: ElementRef;

  @ViewChild('lastPage', { static: true})
  lastPage!: ElementRef;

  customerName?: string;

  page: Page<Order> | null = null;

  orders: Order[] | null = [];

  constructor(private customerService: CustomerOrderService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.getOrders();
  }

  getOrders(pageable?: Pageable) {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (customerId == null) {
      return;
    }
    if (pageable == null) {
      pageable = new Pageable(0, 3);
    }
    this.customerService.findOrders(customerId, pageable)
      .subscribe(page => {
        this.page = page;
        if (this.page == null) {
          return;
        }
        this.orders = this.page.getContent();
        if (!this.customerName && this.orders && this.orders.length > 0) {
          this.customerName = this.orders[0].customerName;
        }
        if (this.page.hasPrevious()) {
          this.firstPage.nativeElement.addEventListener('click', this.onClickFirst.bind(this));
          this.previousPage.nativeElement.addEventListener('click', this.onClickPrevious.bind(this));
        } else {
          this.firstPage.nativeElement.removeEventListener('click', this.onClickFirst.bind(this));
          this.previousPage.nativeElement.removeEventListener('click', this.onClickPrevious.bind(this));
        }
        if (this.page.hasNext()) {
          this.lastPage.nativeElement.addEventListener('click', this.onClickLast.bind(this));
          this.nextPage.nativeElement.addEventListener('click', this.onClickNext.bind(this));
        } else {
          this.lastPage.nativeElement.removeEventListener('click', this.onClickLast.bind(this));
          this.nextPage.nativeElement.removeEventListener('click', this.onClickNext.bind(this));
        }
      });
  }

  onClickFirst() {
    if (this.page != null && this.page.hasPrevious()) {
      this.getOrders(this.page.firstPageable());
    }
  }

  onClickPrevious() {
    if (this.page != null && this.page.hasPrevious()) {
      this.getOrders(this.page.previousPageable());
    }
  }

  onClickNext() {
    if (this.page != null && this.page.hasNext()) {
      this.getOrders(this.page.nextPageable());
    }
  }

  onClickLast() {
    if (this.page != null && this.page.hasNext()) {
      this.getOrders(this.page.lastPageable());
    }
  }

  onClickToCustomer() {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (customerId != null) {
      this.router.navigate([`/customers/${encodeURIComponent(customerId)}`]);
    }
  }

  onClickHome() {
    this.router.navigate(['/home']);
  }
}
