import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer } from './models/customer';
import { Order } from './models/order';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerOrderService {

  constructor(private httpClient: HttpClient) { }

  findCustomer(id: number): Observable<Customer | null> {
    return this.httpClient.get<Customer>(`${environment.baseUrl}/customers/${id}`, { observe: "response" })
    .pipe(map((response: HttpResponse<Customer>) => response.body));
  }

  findOrders(customerId: number): Observable<Order[] | null> {
    return this.httpClient.get<Order[]>(`${environment.baseUrl}/customers/${customerId}/orders`, { observe: "response" })
    .pipe(map((response: HttpResponse<Order[]>) => response.body));
  }
}
