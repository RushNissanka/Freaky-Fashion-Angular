import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  cart$ = new BehaviorSubject<CartItem[]>([]);

  addToCart(item: CartItem) {
    const currentCart = this.cart$.value;
    this.cart$.next([...currentCart, item]);
  }
}
