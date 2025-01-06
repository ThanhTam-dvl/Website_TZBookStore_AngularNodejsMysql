import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  product: any = {};
  categories: any[] = [];
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    // Lấy book_id từ URL
    const id = this.route.snapshot.params['id'];
    this.loadProduct(id);
    this.loadCategories();
  }

  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        console.log('Product loaded:', data);
        this.product = data;
      },
      error: (error) => {
        console.error('Error loading product:', error);
      }
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  previewImage() {
    if (this.product.image_url) {
      // Kiểm tra xem URL ảnh có hợp lệ không
      const img = new Image();
      img.onload = () => {
        // URL hợp lệ, không cần làm gì thêm vì binding sẽ tự cập nhật
        console.log('Image URL is valid');
      };
      img.onerror = () => {
        // URL không hợp lệ
        alert('Invalid image URL. Please check the URL and try again.');
        // Có thể reset về URL cũ hoặc để trống
        this.product.image_url = '';
      };
      img.src = this.product.image_url;
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      // Preview file đã chọn
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.product.image_url = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (confirm('Are you sure you want to update this product?')) {
      console.log('Submitting product:', this.product); // Thêm log để debug

      const formData = new FormData();
      
      // Chuyển đổi giá trị sang string trước khi append
      formData.append('title', String(this.product.title));
      formData.append('category_id', String(this.product.category_id));
      formData.append('author', String(this.product.author));
      formData.append('publisher', this.product.publisher ? String(this.product.publisher) : '');
      formData.append('description', this.product.description ? String(this.product.description) : '');
      formData.append('price', String(this.product.price));
      formData.append('stock_quantity', String(this.product.stock_quantity));
      formData.append('published_date', this.product.published_date ? String(this.product.published_date) : '');

      // Nếu có file upload mới
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      } 
      // Nếu có URL ảnh mới
      else if (this.product.image_url) {
        formData.append('image_url', String(this.product.image_url));
      }

      // Log formData để debug
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      this.productService.updateProduct(this.product.book_id, formData).subscribe({
        next: (response) => {
          console.log('Update successful:', response);
          alert('Product updated successfully');
          this.router.navigate(['/admin/manage-products']);
        },
        error: (error) => {
          console.error('Error updating product:', error);
          alert(`Error updating product: ${error.message || 'Unknown error'}`);
        }
      });
    }
  }
}
