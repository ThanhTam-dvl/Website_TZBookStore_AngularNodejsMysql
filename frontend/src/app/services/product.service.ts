// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/books'; // Đảm bảo đường dẫn API đúng 

  constructor(private http: HttpClient) {}

  // Lấy danh sách tất cả sản phẩm (sách)
  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Lấy chi tiết sản phẩm theo ID
  getBookById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Lấy danh sách sách liên quan theo categoryId
  getBooksByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/books?category_id=${categoryId}`);  
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Lấy sản phẩm bán chạy
  getLowStockBooks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/low-stock`);
  }

  // Thanh toán
  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, orderData);
  }
  
} 
