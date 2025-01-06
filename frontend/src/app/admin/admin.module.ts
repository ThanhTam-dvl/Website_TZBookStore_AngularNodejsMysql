import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ManageOrdersComponent } from './components/manage-orders/manage-orders.component';
import { ManageProductsComponent } from './components/manage-products/manage-products.component';
import { ManageAccountsComponent } from './components/manage-accounts/manage-accounts.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { EditOrderComponent } from './components/edit-order/edit-order.component';
import { DashboardService } from './services/dashboard.service';


@NgModule({
  declarations: [
    DashboardComponent,
    AdminLayoutComponent,
    NavbarComponent,
    ManageOrdersComponent,
    ManageProductsComponent,
    ManageAccountsComponent,
    EditProductComponent,
    AddProductComponent,
    EditOrderComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    SharedModule
  ],
  providers: [
    ProductService,
    CategoryService,
    DashboardService
  ]
})
export class AdminModule {
  constructor() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/admin/style.css'; // CSS admin
    document.head.appendChild(link);
  }
}
