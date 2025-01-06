import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CartBadgeService } from '../../services/cartbadge.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface Book {
  book_id: number;
  title: string;
  price: number;
  image_url: string;
  category_id: number;
  author?: string;
  publisher?: string;
  publish_year?: number;
  pages?: number;
  description?: string;
  short_description?: string;
  old_price?: number;
  thumbnails?: string[];
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  bookId!: number;  // Đánh dấu là chắc chắn được gán giá trị
  book: Book = {} as Book;
  relatedBooks: Book[] = []; // Sách liên quan
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private cartBadgeService: CartBadgeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const bookId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getBookById(bookId).subscribe((data) => {
      this.book = data;
    });

    // Lấy id từ URL và ép kiểu sang number
    this.bookId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchBookDetail();
  }

  // Hàm thay đổi số lượng sản phẩm
  changeQuantity(amount: number): void {
    if (this.quantity + amount >= 1) {
      this.quantity += amount;
    }
  }

  // Lấy chi tiết sách từ API
  fetchBookDetail(): void {
    this.productService.getBookById(this.bookId).subscribe(
      (data) => {
        this.book = data;
        this.fetchRelatedBooks(this.book.category_id); // Lấy sách liên quan
      },
      (error) => {
        console.error('Error fetching book detail:', error);
      }
    );
  }

  // Lấy các sách liên quan
  fetchRelatedBooks(categoryId: number): void {
    this.productService.getBooksByCategory(categoryId).subscribe(
      (data) => {
        this.relatedBooks = data;
      },
      (error) => {
        console.error('Error fetching related books:', error);
      }
    );
  }

  // Tăng số lượng sản phẩm
  increaseQuantity(): void {
    if (this.quantity < 10) {  // Giới hạn số lượng tối đa
      this.quantity++;
    }
  }

  // Giảm số lượng sản phẩm
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Hàm thêm sản phẩm vào giỏ hàng
  addToCart(): void {
    // Kiểm tra đăng nhập
    const currentUser = this.authService.currentUserValue;
    console.log('Current user:', currentUser);

    if (!currentUser || !currentUser.user || !currentUser.user.userId) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      this.router.navigate(['/login']);
      return;
    }

    // Kiểm tra book_id
    if (!this.book || !this.book.book_id) {
      alert('Không tìm thấy thông tin sách!');
      return;
    }

    // Kiểm tra số lượng
    if (this.quantity < 1) {
      alert('Số lượng phải lớn hơn 0!');
      return;
    }

    console.log('Adding to cart:', {
      bookId: this.book.book_id,
      userId: currentUser.user.userId,
      quantity: this.quantity
    });

    // Gọi service với userId đã được xác nhận kiểu dữ liệu
    this.cartService.addToCart(
      this.book.book_id,
      currentUser.user.userId,
      this.quantity
    ).subscribe(
      (response) => {
        console.log('Add to cart response:', response);
        this.cartBadgeService.incrementCartCount(this.quantity);
        alert('Sản phẩm đã được thêm vào giỏ hàng!');
      },
      (error) => {
        console.error('Error adding to cart:', error);
        if (error.status === 403) {
          alert('Bạn không có quyền thực hiện hành động này. Vui lòng đăng nhập lại!');
          this.router.navigate(['/login']);
        } else {
          alert('Có lỗi xảy ra khi thêm vào giỏ hàng: ' + (error.error?.message || 'Không xác định'));
        }
      }
    );
  }

  // Mở modal hình ảnh
  openImageModal(): void {
    console.log('Open image modal');
  }

  
}
