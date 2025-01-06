import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatusMap } from '../../interfaces/order.interface';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  orderDetail: Order = {
    id: 0,
    order_id: 0,
    customer_name: '',
    email: '',
    phone: '',
    address: '',
    status: 'pending',
    items: [],
    total_amount: 0,
    user_id: 0,
    payment_method: '',
    order_notes: '',
    created_at: new Date().toISOString()
  };

  orderStatus: OrderStatusMap = {
    'pending': { width: '25%', text: 'Chờ Xác Nhận', class: 'bg-warning' },
    'processing': { width: '50%', text: 'Đang Xử Lý', class: 'bg-info' },
    'shipping': { width: '75%', text: 'Đang Giao Hàng', class: 'bg-primary' },
    'completed': { width: '100%', text: 'Đã Hoàn Thành', class: 'bg-success' },
    'cancelled': { width: '100%', text: 'Đã Hủy', class: 'bg-danger' }
  };

  statusText: { [key: string]: string } = {
    'pending': 'Chờ Xác Nhận',
    'processing': 'Đang Xử Lý',
    'shipping': 'Đang Giao Hàng',
    'completed': 'Hoàn Thành',
    'cancelled': 'Đã Hủy',
    'cancel_requested': 'Đã Gửi Yêu Cầu Hủy'
  };

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrderDetail(orderId).subscribe(
        (data: Order) => {
          this.orderDetail = data;
        },
        (error) => {
          console.error('Lỗi khi lấy thông tin đơn hàng:', error);
        }
      );
    }
  }

  onCancelOrder(): void {
    if (!this.orderDetail.order_id) return;

    const confirmMessage = this.orderDetail.status === 'processing' 
      ? 'Bạn có chắc muốn gửi yêu cầu hủy đơn hàng này không?' 
      : 'Bạn có chắc muốn hủy đơn hàng này không?';

    if (confirm(confirmMessage)) {
      if (this.orderDetail.status === 'pending') {
        this.orderService.cancelOrder(this.orderDetail.order_id).subscribe({
          next: () => {
            this.orderDetail.status = 'cancelled';
            alert('Đơn hàng đã được hủy thành công');
          },
          error: (error) => {
            console.error('Lỗi khi hủy đơn hàng:', error);
            alert(error.message || 'Có lỗi xảy ra khi hủy đơn hàng');
          }
        });
      } else if (this.orderDetail.status === 'processing') {
        this.orderService.requestCancelOrder(this.orderDetail.order_id).subscribe({
          next: () => {
            this.orderDetail.status = 'cancel_requested';
            alert('Yêu cầu hủy đơn hàng đã được gửi đi');
          },
          error: (error) => {
            console.error('Lỗi khi gửi yêu cầu hủy đơn hàng:', error);
            alert(error.message || 'Có lỗi xảy ra khi gửi yêu cầu hủy đơn hàng');
          }
        });
      }
    }
  }
}
