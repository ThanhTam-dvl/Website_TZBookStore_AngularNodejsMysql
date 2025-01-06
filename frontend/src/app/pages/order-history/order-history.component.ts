
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interfaces/order.interface';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = true;
  error: string = '';

  statusClasses: { [key: string]: string } = {
    'pending': 'bg-warning',
    'processing': 'bg-info',
    'shipping': 'bg-primary',
    'completed': 'bg-success',
    'cancelled': 'bg-danger'
  };

  statusText: { [key: string]: string } = {
    'pending': 'Chờ Xác Nhận',
    'processing': 'Đang Xử Lý',
    'shipping': 'Đang Giao Hàng',
    'completed': 'Hoàn Thành',
    'cancelled': 'Đã Hủy'
  };

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    console.log('Loading orders...');
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        console.log('Received orders:', orders);
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  viewOrderDetails(orderId: number): void {
    if (orderId) {
      this.router.navigate(['/order-detail', orderId]);
    }
  }

  getStatusClass(status: string): string {
    return this.statusClasses[status] || 'bg-secondary';
  }

  getStatusText(status: string): string {
    return this.statusText[status] || status;
  }
}
