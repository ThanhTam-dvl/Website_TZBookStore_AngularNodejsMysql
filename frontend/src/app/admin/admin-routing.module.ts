import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { ManageOrdersComponent } from './components/manage-orders/manage-orders.component';
import { ManageProductsComponent } from './components/manage-products/manage-products.component';
import { ManageAccountsComponent } from './components/manage-accounts/manage-accounts.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditOrderComponent } from './components/edit-order/edit-order.component';


const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent, // Admin layout sẽ làm layout chính
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redirect đến Dashboard
      { path: 'dashboard', component: DashboardComponent },    // Route Dashboard
      { path: 'navbar', component: NavbarComponent },          // Route Navbar
      { path: 'manage-orders', component: ManageOrdersComponent },
      { path: 'manage-products', component: ManageProductsComponent },
      { path: 'manage-accounts', component: ManageAccountsComponent },
      { path: 'edit-product/:id', component: EditProductComponent },
      { path: 'add-product', component: AddProductComponent },
      { path: 'edit-order', component: EditOrderComponent },
      { path: 'edit-order/:id', component: EditOrderComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
