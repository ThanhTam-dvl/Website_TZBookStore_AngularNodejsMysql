import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface LoginError {
  error: {
    message: string;
  };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.authService.login(this.loginData.email, this.loginData.password)
      .subscribe(
        response => {
          console.log('Đăng nhập thành công', response);
          if (response.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
        (error: LoginError) => {
          console.error('Lỗi đăng nhập:', error);
          this.errorMessage = error.error.message || 'Đăng nhập thất bại';
        }
      );
  }
}
