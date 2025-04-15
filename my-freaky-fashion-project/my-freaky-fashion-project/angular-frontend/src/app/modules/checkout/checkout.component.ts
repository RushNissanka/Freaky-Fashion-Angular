import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from 'src/app/core/cart.service';
import { Product } from 'src/app/core/product.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  name = '';
  email = '';
  address = '';
  phone = '';
  shippingMethod = 'standard';
  paymentMethod = 'card';

  constructor(public cartService: CartService) {}

  get cart() {
    return this.cartService.cart$.value;
  }  

  get totalItems() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get shippingCost() {
    return this.shippingMethod === 'express' ? 99 : 49;
  }

  handleSubmit(): void {
    console.log('Submitting order', {
      name: this.name,
      email: this.email,
      address: this.address,
      phone: this.phone,
      shippingMethod: this.shippingMethod,
      paymentMethod: this.paymentMethod
    });
    alert('Order submitted! ✅');
  }
}
