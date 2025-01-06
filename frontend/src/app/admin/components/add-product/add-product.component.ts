import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  product: any = {
    title: '',
    author: '',
    publisher: '',
    description: '',
    category_id: null,
    price: 0,
    stock_quantity: 0,
    published_date: '',
    image_url: ''
  };
  
  categories: any[] = [];
  selectedFile: File | null = null;

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
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
      const img = new Image();
      img.onload = () => {
        console.log('Image URL is valid');
      };
      img.onerror = () => {
        alert('Invalid image URL. Please check the URL and try again.');
        this.product.image_url = '';
      };
      img.src = this.product.image_url;
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.product.image_url = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (confirm('Are you sure you want to add this product?')) {
      console.log('Submitting product:', this.product);

      const formData = new FormData();
      
      formData.append('title', String(this.product.title));
      formData.append('category_id', String(this.product.category_id));
      formData.append('author', String(this.product.author));
      formData.append('publisher', this.product.publisher ? String(this.product.publisher) : '');
      formData.append('description', this.product.description ? String(this.product.description) : '');
      formData.append('price', String(this.product.price));
      formData.append('stock_quantity', String(this.product.stock_quantity));
      formData.append('published_date', this.product.published_date ? String(this.product.published_date) : '');

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      } else if (this.product.image_url) {
        formData.append('image_url', String(this.product.image_url));
      }

      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      this.productService.createProduct(formData).subscribe({
        next: (response) => {
          console.log('Product added successfully:', response);
          alert('Product added successfully');
          this.router.navigate(['/admin/manage-products']);
        },
        error: (error) => {
          console.error('Error adding product:', error);
          alert(`Error adding product: ${error.message || 'Unknown error'}`);
        }
      });
    }
  }
}
