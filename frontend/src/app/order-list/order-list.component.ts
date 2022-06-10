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

  customerId?: string;

  customerName?: string;

  page: Page<Order> | null = null;

  orders: Order[] | null = [];

  constructor(private customerService: CustomerOrderService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    Pageable.setDefaultSize(3);
    this.route.params.subscribe(params => {
      this.customerId = params['id'];
    });
    this.route.queryParams.subscribe(params => {
      const page = params['page'] ? parseInt(params['page'], 10) -1 : 0;
      const size = params['size'];
      let pageable = null;
      pageable = new Pageable(page, size);
      this.getOrderPage(this.customerId, pageable);
    });
  }

  ngAfterViewInit(): void {
    this.firstPage.nativeElement.addEventListener('click', this.onClickFirst.bind(this));
    this.previousPage.nativeElement.addEventListener('click', this.onClickPrevious.bind(this));

    this.lastPage.nativeElement.addEventListener('click', this.onClickLast.bind(this));
    this.nextPage.nativeElement.addEventListener('click', this.onClickNext.bind(this));
  }

  getOrderPage(customerId?: string, pageable?: Pageable) {
    console.log(`get order page ${pageable} for customer ${customerId}`);
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
      });
  }

  onClickFirst() {
    if (this.customerId != null && this.page != null && this.page.hasPrevious()) {
      this.navigateToPage(this.customerId, this.page.firstPageable());
    }
  }

  onClickPrevious() {
    if (this.customerId != null && this.page != null && this.page.hasPrevious()) {
      this.navigateToPage(this.customerId, this.page.previousPageable());
    }
  }

  onClickNext() {
    if (this.customerId != null && this.page != null && this.page.hasNext()) {
      this.navigateToPage(this.customerId, this.page.nextPageable());
    }
  }

  onClickLast() {
    if (this.customerId != null && this.page != null && this.page.hasNext()) {
      this.navigateToPage(this.customerId, this.page.lastPageable());
    }
  }

  navigateToPage(customerId: string, pageable: Pageable) {
    this.router.navigate([`/customers/${encodeURIComponent(customerId)}/orders`], { queryParams: { page: pageable.getPage() + 1, size: pageable.getSize() } });
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
