import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from 'src/app/core/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  constructor(public cartService: CartService) {}

  get cart() {
    return this.cartService.cart$.value;
  }

  get totalPrice(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  updateQuantity(id: number, newQty: string | number): void {
    const quantity = Number(newQty);
    if (!isNaN(quantity) && quantity > 0) {
      this.cartService.updateQuantity(id, quantity);
    }
  }

  removeItem(id: number): void {
    this.cartService.removeFromCart(id);
  }

  goToCheckout(): void {
    // Optionally use Angular routing if you're using <router-outlet>
    window.location.href = '/checkout';
    // Or navigate programmatically:
    // this.router.navigate(['/checkout']);
  }
}
