import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../interfaces/order.interface';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderData = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: '',
    notes: '',
    user_id: 0
  };

  orderItems: any[] = [];
  totalAmount: number = 0;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService
  ) {
    // Lấy dữ liệu từ navigation state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      items: any[];
      totalAmount: number;
      userId: number;
    };

    if (state) {
      this.orderItems = state.items;
      this.totalAmount = state.totalAmount;
      this.orderData.user_id = state.userId;
    } else {
      this.router.navigate(['/cart']);
    }
  }

  ngOnInit(): void {
    // Kiểm tra đăng nhập
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Tự động điền thông tin người dùng
    this.orderData.fullName = currentUser.user.fullName || '';
    this.orderData.email = currentUser.user.email || '';
    this.orderData.user_id = currentUser.user.userId;

    // Kiểm tra có dữ liệu giỏ hàng không
    if (!this.orderItems.length) {
      this.router.navigate(['/cart']);
    }
  }

  onConfirmOrder(): void {
    if (!this.validateForm()) {
      return;
    }

    const orderPayload: Omit<Order, 'id'> = {
      order_id: 0,
      user_id: this.orderData.user_id,
      customer_name: this.orderData.fullName,
      email: this.orderData.email,
      phone: this.orderData.phone,
      address: this.orderData.address,
      payment_method: this.orderData.paymentMethod,
      order_notes: this.orderData.notes || '',
      items: this.orderItems.map(item => ({
        book_id: item.book_id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url,
        subtotal: item.price * item.quantity
      })),
      total_amount: this.totalAmount,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    console.log('Creating order with:', orderPayload);

    this.orderService.createOrder(orderPayload).subscribe({
      next: (response: Order) => {
        console.log('Order created successfully:', response);
        // Xóa các item đã đặt khỏi giỏ hàng
        this.removeOrderedItems().then(() => {
          // Chuyển đến trang chi tiết đơn hàng
          this.router.navigate(['/order-detail', response.id]);
        });
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.errorMessage = error.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!';
      }
    });
  }

  private validateForm(): boolean {
    if (!this.orderData.fullName || !this.orderData.email || 
        !this.orderData.phone || !this.orderData.address || 
        !this.orderData.paymentMethod) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin bắt buộc!';
      return false;
    }
    return true;
  }

  private async removeOrderedItems(): Promise<void> {
    const promises = this.orderItems.map(item => 
      new Promise<void>((resolve) => {
        if (item.cart_item_id) {
          this.cartService.removeCartItem(item.cart_item_id).subscribe({
            next: () => resolve(),
            error: (err) => {
              console.error(`Lỗi khi xóa item ${item.cart_item_id}:`, err);
              resolve();
            }
          });
        } else {
          resolve();
        }
      })
    );

    await Promise.all(promises);
  }
}
