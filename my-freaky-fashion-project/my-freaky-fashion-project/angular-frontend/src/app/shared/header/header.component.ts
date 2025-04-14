import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CartService } from '../../core/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule]
})
export class HeaderComponent {
  @Input() searchTerm: string = '';
  @Output() searchTermChange = new EventEmitter<string>();

  faShoppingCart = faShoppingCart;
  totalItems: number = 0;

  constructor(private cartService: CartService) {
    // 🔄 Subscribe to cart updates from the CartService
    this.cartService.cart$.subscribe(cart => {
      this.totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  // 📥 Handle search input changes and emit the new search value
  onSearchInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTermChange.emit(value);
  }
}
