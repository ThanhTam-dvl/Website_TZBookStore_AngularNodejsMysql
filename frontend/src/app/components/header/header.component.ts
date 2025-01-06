import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { CartBadgeService } from '../../services/cartbadge.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { filter } from 'rxjs/operators';

interface Category {
  category_id: number;
  category_name: string;
  description?: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  categories: Category[] = [];
  cartCount: number = 0;
  isProductDetailPage: boolean = false;
  currentUser: any = null;
  isProductsRoute: boolean = false;
  isAuthPage: boolean = false;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private cartBadgeService: CartBadgeService,
    private authService: AuthService
  ) {
    // Kiểm tra route hiện tại
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAuthPage = event.url.includes('/Login') || event.url.includes('/Register');
        this.isProductDetailPage = 
        event.url.includes('/product-detail/') ||
        event.url.includes('/Shoppingcart') ||
        event.url.includes('/Order') ||
        event.url.includes('/order-history') ||
        event.url.includes('/order-detail/');
      }
    });

    // Subscribe to router events to check if we're on a Products route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isProductsRoute = event.url.includes('/Products');
    });
  }

  ngOnInit(): void {
    // Lấy danh sách categories
    this.categoryService.getCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error: any) => {
        console.error('Error fetching categories:', error);
      }
    );

    // Theo dõi số lượng giỏ hàng
    this.cartBadgeService.cartCount$.subscribe(
      (count: number) => {
        this.cartCount = count;
      }
    );

    // Theo dõi trạng thái đăng nhập
    this.authService.currentUser.subscribe(
      (user: any) => {
        this.currentUser = user;
      }
    );
  }

  logout(): void {
    // Sử dụng SweetAlert2 để hiển thị dialog xác nhận đẹp hơn
    Swal.fire({
      title: 'Xác nhận đăng xuất',
      text: 'Bạn có chắc chắn muốn đăng xuất?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d4a373',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        Swal.fire({
          title: 'Đã đăng xuất!',
          text: 'Đăng xuất thành công',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }
}
