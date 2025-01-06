import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

interface RegisterResponse {
  message: string;
  userId?: number;
}

interface RegisterError {
  error: {
    message: string;
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: 'customer' as const
  };
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Mật khẩu xác nhận không khớp'
      });
      return;
    }

    const { confirmPassword, ...registrationData } = this.registerData;

    this.authService.register(registrationData)
      .subscribe(
        (response: RegisterResponse) => {
          console.log('Đăng ký thành công', response);
          Swal.fire({
            icon: 'success',
            title: 'Đăng ký thành công!',
            text: 'Vui lòng đăng nhập để tiếp tục',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        (error: RegisterError) => {
          console.error('Lỗi đăng ký:', error);
          Swal.fire({
            icon: 'error',
            title: 'Lỗi đăng ký',
            text: error.error.message || 'Đăng ký thất bại'
          });
        }
      );
  }
}
