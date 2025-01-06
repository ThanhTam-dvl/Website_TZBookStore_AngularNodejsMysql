import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Order } from '../interfaces/order.interface';
import { AuthService } from './auth.service';
import { CreateOrderDTO } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.currentUserValue?.token;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createOrder(orderData: CreateOrderDTO): Observable<Order> {
    console.log('Sending order data:', orderData);
    return this.http.post<Order>(this.apiUrl, orderData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getOrderDetail(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/cancel`, 
      { status: 'cancelled' }, 
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  requestCancelOrder(orderId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/request-cancel`,
      { status: 'cancel_requested' },
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getUserOrders(): Observable<Order[]> {
    console.log('Fetching user orders...');
    return this.http.get<Order[]>(`${this.apiUrl}/my-orders`, { headers: this.getHeaders() })
      .pipe(
        map(orders => {
          console.log('Raw orders data:', orders);
          return orders.map(order => ({
            ...order,
            order_id: order.order_id,
            created_at: order.created_at
          }));
        }),
        catchError(error => {
          console.error('Error in getUserOrders:', error);
          return throwError(() => error);
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Đã xảy ra lỗi không xác định';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || 
                    error.message || 
                    `Mã lỗi: ${error.status}, Nội dung: ${error.error}`;
      console.error('Error details:', error);
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
