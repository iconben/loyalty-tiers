import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer } from '../models/customer';
import { Order } from '../models/order';
import { environment } from '../../environments/environment';
import { Page } from './page';
import { Pageable } from './pageable';

@Injectable({
  providedIn: 'root'
})
export class CustomerOrderService {

  constructor(private httpClient: HttpClient) { }

  findCustomer(id: string): Observable<Customer | null> {
    return this.httpClient.get<Customer>(`${environment.baseUrl}/customers/${id}`, { observe: "response" })
    .pipe(map((response: HttpResponse<Customer>) => response.body));
  }

  findOrders(customerId: string): Observable<Order[] | null>;
  findOrders(customerId: string, pageable: Pageable): Observable<Page<Order>>;
  findOrders(customerId: string, pageable?: Pageable): Observable<Page<Order>> | Observable<Order[] | null> {
    if (pageable && pageable.isPaged()) {
      return this.httpClient.get<Order[]>(`${environment.baseUrl}/customers/${customerId}/orders?${pageable.getFullQueryString()}`, { observe: "response" })
      .pipe(map((response: HttpResponse<Order[]>) => new Page(response)));
    } else {
      return this.httpClient.get<Order[]>(`${environment.baseUrl}/customers/${customerId}/orders`, { observe: "response" })
      .pipe(map((response: HttpResponse<Order[]>) => response.body));
    }
  }
}
