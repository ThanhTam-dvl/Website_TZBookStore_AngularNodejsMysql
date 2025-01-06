import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartBadgeService {
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  updateCartCount(count: number): void {
    this.cartCountSubject.next(count);
  }

  incrementCartCount(amount: number): void {
    const currentCount = this.cartCountSubject.value;
    this.cartCountSubject.next(currentCount + amount);
  }

  decrementCartCount(amount: number): void {
    const currentCount = this.cartCountSubject.value;
    this.cartCountSubject.next(Math.max(0, currentCount - amount));
  }
}
