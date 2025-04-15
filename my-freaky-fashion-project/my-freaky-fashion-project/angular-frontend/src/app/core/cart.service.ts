import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  cart$ = new BehaviorSubject<CartItem[]>([]);

  addToCart(item: CartItem) {
    const currentCart = this.cart$.value;
    const existingItemIndex = currentCart.findIndex(p => p.id === item.id);

    if (existingItemIndex > -1) {
      const updatedItem = {
        ...currentCart[existingItemIndex],
        quantity: currentCart[existingItemIndex].quantity + item.quantity
      };

      const updatedCart = [...currentCart];
      updatedCart[existingItemIndex] = updatedItem;
      this.cart$.next(updatedCart);
    } else {
      this.cart$.next([...currentCart, item]);
    }
  }

  updateQuantity(productId: number, newQuantity: number) {
    const updatedCart = this.cart$.value.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    this.cart$.next(updatedCart);
  }

  removeFromCart(productId: number) {
    const updatedCart = this.cart$.value.filter(item => item.id !== productId);
    this.cart$.next(updatedCart);
  }

  clearCart() {
    this.cart$.next([]);
  }
}
