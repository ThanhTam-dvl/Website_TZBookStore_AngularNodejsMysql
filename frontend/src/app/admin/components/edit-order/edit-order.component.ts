import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminOrderService } from '../../services/admin-order.service';
import { Order } from '../../../interfaces/order.interface';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit {
  orderId: number = 0;
  order: Order | null = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminOrderService: AdminOrderService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = +params['id'];
      this.loadOrderDetails();
    });
  }

  loadOrderDetails(): void {
    this.loading = true;
    this.adminOrderService.getOrderById(this.orderId).subscribe({
      next: (data) => {
        this.order = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải thông tin đơn hàng';
        this.loading = false;
        console.error('Error loading order:', err);
      }
    });
  }

  onSubmit(): void {
    if (!this.order) return;

    this.adminOrderService.updateOrder(this.orderId, this.order).subscribe({
      next: () => {
        alert('Cập nhật đơn hàng thành công');
        this.router.navigate(['/admin/manage-orders']);
      },
      error: (err) => {
        alert('Lỗi khi cập nhật đơn hàng');
        console.error('Error updating order:', err);
      }
    });
  }
}
