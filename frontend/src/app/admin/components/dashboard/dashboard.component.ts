import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Chart, registerables } from 'chart.js/auto';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  lowStockBooks: any[] = [];
  recentOrders: any[] = [];
  orderStats: any = {
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.initCharts();
  }

  loadDashboardData() {
    // Load sách có số lượng thấp
    this.dashboardService.getLowStockBooks().subscribe(
      (data) => {
        this.lowStockBooks = data;
      },
      (error) => {
        console.error('Error fetching low stock books:', error);
      }
    );

    // Load đơn hàng gần đây
    this.dashboardService.getRecentOrders().subscribe(
      (data) => {
        this.recentOrders = data.slice(0, 5); // Chỉ lấy 5 đơn hàng gần nhất
      },
      (error) => {
        console.error('Error fetching recent orders:', error);
      }
    );

    // Load thống kê đơn hàng
    this.dashboardService.getOrderStats().subscribe(
      (data) => {
        this.orderStats = data;
        this.updateCharts();
      },
      (error) => {
        console.error('Error fetching order stats:', error);
      }
    );
  }

  initCharts() {
    // Khởi tạo biểu đồ
    const orderStatusChart = new Chart('orderStatusChart', {
      type: 'pie',
      data: {
        labels: ['Chờ xử lý', 'Đang xử lý', 'Hoàn thành', 'Đã hủy'],
        datasets: [{
          data: [0, 0, 0, 0],
          backgroundColor: [
            '#ffc107',
            '#17a2b8',
            '#28a745',
            '#dc3545'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  updateCharts() {
    // Cập nhật dữ liệu biểu đồ
    const chartElement = document.getElementById('orderStatusChart') as HTMLCanvasElement;
    const chart = Chart.getChart(chartElement);
    if (chart) {
      chart.data.datasets[0].data = [
        this.orderStats.pending,
        this.orderStats.processing,
        this.orderStats.completed,
        this.orderStats.cancelled
      ];
      chart.update();
    }
  }
}
