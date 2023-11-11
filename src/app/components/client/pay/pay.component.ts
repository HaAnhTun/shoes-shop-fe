import { Component } from '@angular/core';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent {
  basePrice: number = 1790000; // Giá cơ bản của sản phẩm
  shippingCost: number = 0; // Phí giao hàng ban đầu là 0
  totalPrice: number = this.basePrice + this.shippingCost; // Tổng giá ban đầu

  updateShippingCost(cost: number) {
    this.shippingCost = cost;
    this.totalPrice = this.basePrice + this.shippingCost; // Cập nhật tổng giá
  }
}
