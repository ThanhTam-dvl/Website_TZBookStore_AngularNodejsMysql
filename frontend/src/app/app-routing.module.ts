import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ShoppingCartComponent } from './pages/shoppingcart/shoppingcart.component';
import { OrderComponent } from './pages/order/order.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'Home', component: HomeComponent},
  { path: 'Header', component: HeaderComponent},
  { path: 'Footer', component: FooterComponent},
  { path: 'About', component: AboutComponent},
  { path: 'Contact', component: ContactComponent},
  { path: 'Login', component: LoginComponent},
  { path: 'Register', component: RegisterComponent},
  { path: 'Shoppingcart', component: ShoppingCartComponent},
  { path: 'Order', component: OrderComponent},
  { path: 'Product', component: ProductComponent},
  { path: 'product/:id', component: ProductDetailComponent},
  { path: 'Products/:categoryId', component: ProductComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'order-history', component: OrderHistoryComponent},
  { path: 'order-detail/:id', component: OrderDetailComponent},
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
