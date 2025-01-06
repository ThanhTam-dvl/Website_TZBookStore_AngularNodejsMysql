import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  selectedProducts: number[] = [];
  newCategory: any = {
    category_name: '',
    description: ''
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log('Products loaded:', data);
        this.products = data;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        console.log('Categories loaded:', data);
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onSelectProduct(event: any) {
    const productId = parseInt(event.target.value);
    if (event.target.checked) {
      this.selectedProducts.push(productId);
    } else {
      const index = this.selectedProducts.indexOf(productId);
      if (index > -1) {
        this.selectedProducts.splice(index, 1);
      }
    }
  }

  onEditProduct(productId: number) {
    this.router.navigate(['/admin/edit-product', productId]);
  }

  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe(
        () => {
          this.loadProducts();
        },
        (error) => {
          console.error('Error deleting product:', error);
        }
      );
    }
  }

  deleteSelectedProducts() {
    if (this.selectedProducts.length === 0) {
      alert('Please select products to delete');
      return;
    }

    if (confirm('Are you sure you want to delete selected products?')) {
      this.productService.deleteMultipleProducts(this.selectedProducts).subscribe(
        () => {
          this.loadProducts();
          this.selectedProducts = [];
        },
        (error) => {
          console.error('Error deleting products:', error);
        }
      );
    }
  }

  deleteCategory(categoryId: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(categoryId).subscribe(
        () => {
          this.loadCategories();
        },
        (error) => {
          console.error('Error deleting category:', error);
        }
      );
    }
  }

  openAddCategoryModal() {
    // Implement logic to open modal for adding new category
  }

  onSubmitCategory() {
    if (confirm('Are you sure you want to add this category?')) {
      console.log('Submitting category:', this.newCategory);

      this.categoryService.createCategory(this.newCategory).subscribe({
        next: (response) => {
          console.log('Category added successfully:', response);
          alert('Category added successfully');
          
          // Đóng modal bằng cách tìm element và gọi hide()
          const modalElement = document.getElementById('addCategoryModal');
          if (modalElement) {
            const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            }
          }

          // Reset form
          this.newCategory = {
            category_name: '',
            description: ''
          };
          // Reload categories
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error adding category:', error);
          alert(`Error adding category: ${error.message || 'Unknown error'}`);
        }
      });
    }
  }
}
