
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminOrderService } from '../../services/admin-order.service';
import { Order } from '../../../interfaces/order.interface';


@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})

export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = true;
  error: string = '';

  statusClasses: { [key: string]: string } = {
    'pending': 'bg-warning text-dark',
    'processing': 'bg-info text-white',
    'shipping': 'bg-primary text-white',
    'completed': 'bg-success text-white',
    'cancelled': 'bg-danger text-white',
    'cancel_requested': 'bg-warning text-dark'
  };

  statusText: { [key: string]: string } = {
    'pending': 'Chờ Xác Nhận',
    'processing': 'Đang Xử Lý',
    'shipping': 'Đang Giao Hàng',
    'completed': 'Hoàn Thành',
    'cancelled': 'Đã Hủy',
    'cancel_requested': 'Yêu Cầu Hủy'
  };

  constructor(
    private adminOrderService: AdminOrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.adminOrderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Không thể tải danh sách đơn hàng';
        this.loading = false;
        console.error('Error loading orders:', error);
      }
    });
  }

  updateOrderStatus(orderId: number, newStatus: string): void {
    this.adminOrderService.updateOrder(orderId, { status: newStatus }).subscribe({
      next: () => {
        const order = this.orders.find(o => o.order_id === orderId);
        if (order) {
          order.status = newStatus;
        }
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Không thể cập nhật trạng thái đơn hàng');
      }
    });
  }

  handleCancellationRequest(orderId: number, approve: boolean): void {
    const action = approve ? 
      this.adminOrderService.approveOrderCancellation(orderId) :
      this.adminOrderService.rejectOrderCancellation(orderId);

    action.subscribe({
      next: () => {
        const order = this.orders.find(o => o.order_id === orderId);
        if (order) {
          order.status = approve ? 'cancelled' : 'processing';
        }
        alert(approve ? 'Đã chấp nhận hủy đơn hàng' : 'Đã từ chối yêu cầu hủy đơn hàng');
      },
      error: (error) => {
        console.error('Error handling cancellation request:', error);
        alert('Không thể xử lý yêu cầu hủy đơn hàng');
      }
    });
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/admin/edit-order', orderId]);
  }

  getStatusClass(status: string): string {
    return this.statusClasses[status] || 'badge bg-secondary';
  }

  getStatusText(status: string): string {
    return this.statusText[status] || status;
  }

}
