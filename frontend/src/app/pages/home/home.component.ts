import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {
  lowStockBooks: any[] = []; // Mảng lưu trữ 6 sản phẩm có số lượng ít nhất

  constructor(private productService: ProductService) {}

  // Gọi API khi component khởi tạo
  ngOnInit(): void {
    this.productService.getLowStockBooks().subscribe(
      (data) => {
        this.lowStockBooks = data; // Gán dữ liệu vào mảng
      },
      (error) => {
        console.error('Error fetching low-stock books:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    // Khởi tạo Owl Carousel
    $('.header-carousel').owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      responsive: {
        0: { items: 1 },
        600: { items: 1 },
        1000: { items: 1 }
      }
    });

    $('.testimonial-carousel').owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 3 }
      }
    });
  }
}
