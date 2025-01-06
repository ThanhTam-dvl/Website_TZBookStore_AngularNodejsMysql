import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isManageActive(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('/manage-products') || 
           currentUrl.includes('/manage-accounts') || 
           currentUrl.includes('/manage-orders');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); 
  }
}
