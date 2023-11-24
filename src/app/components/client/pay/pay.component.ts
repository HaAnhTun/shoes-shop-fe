import { Component, OnInit } from "@angular/core";
import { CartDetailCustomerService } from "src/app/service/cartdetailcustom.service";

@Component({
  selector: "app-pay",
  templateUrl: "./pay.component.html",
  styleUrls: ["./pay.component.css"],
})
export class PayComponent implements OnInit {
  checkCartDetailCustom: any[];
  shippingCost: number = 0; // Phí giao hàng ban đầu là 0
  totalPrice: number = 0;
  totalPayment: number = 0;
  constructor(private cartDetailCustomerService: CartDetailCustomerService) {
    this.checkCartDetailCustom =
      this.cartDetailCustomerService.getCartDetailCustomerService();
  }

  ngOnInit() {
    this.checkCartDetailCustom.map((customer) => {
      this.totalPrice = this.totalPrice + customer.price * customer.quantity;
    });
  }
  updateShippingCost(cost: number) {
    this.totalPayment = this.totalPrice + this.shippingCost; // Cập nhật tổng giá
  }
}
