import { Component } from '@angular/core';
import { Router, NavigationStart, Scroll, NavigationEnd } from '@angular/router';
import { CartService } from './services/cart.service';
import { CartBadgeService } from './services/cartbadge.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userId = 1; // Tạm thời giả định ID người dùng
  showLayout = true;
  isAuthPage = false;

  constructor(
    private router: Router,
    private cartService: CartService,
    private cartBadgeService: CartBadgeService,
    private viewportScroller: ViewportScroller
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAuthPage = event.url.includes('/Login') || event.url.includes('/Register');
        this.showLayout = !event.url.startsWith('/admin') && !this.isAuthPage;
      }

      if (event instanceof NavigationStart) {
        // Kiểm tra xem route có bắt đầu với "/admin" hay không và ẩn layout nếu cần
        this.showLayout = !event.url.startsWith('/admin');
      }

      if (event instanceof Scroll) {
        // Cuộn đến đầu trang mỗi khi điều hướng
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });

    // Cập nhật số lượng giỏ hàng
    this.updateCartCount();
  }

  updateCartCount(): void {
    this.cartService.getCartItemCount(this.userId).subscribe(
      (data) => {
        this.cartBadgeService.updateCartCount(data.total_items);
      },
      (error) => {
        console.error('Error fetching cart count:', error);
      }
    );
  }

  title = 'TZBookStore';
}
