import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

interface User {
  user_id?: number;
  username: string;
  email: string;
  full_name: string;
  gender?: 'Male' | 'Female' | 'Other';
  birth_date?: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'customer' | 'staff';
  is_active: boolean;
  created_at?: string;
  password?: string; // For new account creation
}

@Component({
  selector: 'app-manage-accounts',
  templateUrl: './manage-accounts.component.html',
  styleUrls: ['./manage-accounts.component.css']
})
export class ManageAccountsComponent implements OnInit {
  // Properties used in template
  users: User[] = [];
  selectedRole: string = '0';
  selectedUser: User | null = null;
  roles = [
    { value: '0', label: 'Select account' },
    { value: 'admin', label: 'Admin' },
    { value: 'staff', label: 'Staff' },
    { value: 'customer', label: 'Customer' }
  ];
  isCreatingNew: boolean = false;
  currentUser: User = this.getEmptyUser();

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.token || currentUser.user?.role !== 'admin') {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUsers('0');
  }

  // Method called from template
  onRoleChange(event: any): void {
    const selectedRole = event.target.value;
    this.selectedRole = selectedRole;
    this.selectedUser = null;
    this.loadUsers(selectedRole);
  }

  // Method called from template
  selectUser(user: User): void {
    this.isCreatingNew = false;
    this.selectedUser = { ...user };
    this.currentUser = { ...user };
  }

  // Method called from template
  onSubmit(formData: any): void {
    if (this.isCreatingNew) {
      this.accountService.createUser(formData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Account created successfully',
            timer: 1500
          });
          this.loadUsers(this.selectedRole);
          this.cancelEdit();
        },
        error: (error) => {
          console.error('Error creating account:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Error creating account'
          });
        }
      });
    } else if (this.selectedUser && this.selectedUser.user_id) {
      this.accountService.updateUser(this.selectedUser.user_id, formData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Profile updated successfully',
            timer: 1500
          });
          this.loadUsers(this.selectedRole);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Error updating profile'
          });
        }
      });
    }
  }

  // Method called from template
  onDeleteAccount(): void {
    if (this.selectedUser && this.selectedUser.user_id) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.accountService.deleteUser(this.selectedUser!.user_id!)
            .subscribe({
              next: () => {
                Swal.fire({
                  icon: 'success',
                  title: 'Deleted!',
                  text: 'Account has been deleted.',
                  timer: 1500
                });
                this.selectedUser = null;
                this.loadUsers(this.selectedRole);
              },
              error: (error) => {
                console.error('Error deleting account:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: error.error?.message || 'Error deleting account'
                });
              }
            });
        }
      });
    }
  }

  private loadUsers(role: string): void {
    console.log('Loading users for role:', role);
    const loadingFn = role === '0' ? 
      this.accountService.getAllUsers() : 
      this.accountService.getUsersByRole(role);

    loadingFn.subscribe({
      next: (users) => {
        console.log('Received users:', users);
        this.users = users;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/login']);
        } else {
          alert('Error loading users. Please try again.');
        }
      }
    });
  }

  // Thêm method để validate email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  // Helper method to create empty user object
  private getEmptyUser(): User {
    return {
      username: '',
      email: '',
      full_name: '',
      role: 'customer',
      is_active: true
    };
  }

  // Create new account
  createNewAccount(): void {
    this.isCreatingNew = true;
    this.currentUser = this.getEmptyUser();
    this.selectedUser = null;
  }

  // Cancel editing/creating
  cancelEdit(): void {
    this.isCreatingNew = false;
    this.selectedUser = null;
    this.currentUser = this.getEmptyUser();
  }
}
