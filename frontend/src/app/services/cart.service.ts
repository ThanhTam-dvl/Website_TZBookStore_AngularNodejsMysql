import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/carts';
  private cartItems: any[] = [];
  private cartItemCount = new BehaviorSubject<number>(0);
  private cartTotalAmount = new BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.currentUserValue?.token;
    console.log('Current token:', token);
    
    if (!token) {
      console.warn('No token found!');
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  //Thêm vào giỏ hàng
  addToCart(bookId: number, userId: number, quantity: number): Observable<any> {
    const headers = this.getHeaders();
    const body = {
      book_id: bookId,
      user_id: userId,
      quantity: quantity
    };
    
    console.log('Sending request:', {
      url: `${this.apiUrl}/add`,
      body,
      headers: headers.keys(),
      token: headers.get('Authorization')
    });
    
    return this.http.post(`${this.apiUrl}/add`, body, { headers });
  }

  //Lấy danh sách sản phẩm trong giỏ hàng
  getCartItems(userId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/${userId}`, { headers });
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItem(cartItemId: number, quantity: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}/update`,
      { cart_item_id: cartItemId, quantity },
      { headers }
    );
  }

  // Xóa sản phẩm khỏi giỏ hàng
  removeCartItem(cartItemId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/remove/${cartItemId}`, { headers });
  }

  // Đếm sản phẩm trong giỏ hàng
  getCartItemCount(userId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/count/${userId}`, { headers });
  }

  // Thêm phương thức clearCart để xóa toàn bộ giỏ hàng
  clearCart() {
    this.cartItems = [];
    this.cartItemCount.next(0);
    this.cartTotalAmount.next(0);
    // Nếu bạn lưu giỏ hàng trong localStorage, hãy xóa nó
    localStorage.removeItem('cartItems');
  }
}
