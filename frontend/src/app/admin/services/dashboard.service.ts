import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getLowStockBooks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/books/low-stock`);
  }

  getRecentOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`);
  }

  getOrderStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/stats`);
  }
} 