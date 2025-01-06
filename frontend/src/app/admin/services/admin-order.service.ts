import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../interfaces/order.interface';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminOrderService {
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

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateOrder(id: number, orderData: Partial<Order>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, orderData, { headers: this.getHeaders() });
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  approveOrderCancellation(orderId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${orderId}/approve-cancellation`, 
      {}, 
      { headers: this.getHeaders() }
    );
  }

  rejectOrderCancellation(orderId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${orderId}/reject-cancellation`, 
      {}, 
      { headers: this.getHeaders() }
    );
  }
} 