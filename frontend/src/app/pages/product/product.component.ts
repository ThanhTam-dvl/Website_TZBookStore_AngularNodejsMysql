import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  books: any[] = []; // Dữ liệu sách sẽ được lưu ở đây
  categoryId!: number;

  constructor(private productService: ProductService, private route: ActivatedRoute, private http: HttpClient) {}
  

  ngOnInit(): void {
    this.fetchBooks();
    this.route.params.subscribe((params) => {
      this.categoryId = params['categoryId'];
      this.loadBooks();
    });
  }

  // Lấy danh sách sách từ API
  fetchBooks(): void {
    this.productService.getBooks().subscribe(
      (data) => {
        this.books = data; // Gán dữ liệu vào biến books
      },
      (error) => {
        console.error('Error fetching books:', error);
      }
    );
  }

  loadBooks(): void {
    this.http
      .get<any[]>(`http://localhost:5000/api/books/category/${this.categoryId}`)
      .subscribe(
        (data) => {
          this.books = data;
        },
        (error) => {
          console.error('Error loading books:', error);
        }
      );
  }
}
