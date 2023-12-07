import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import {
  ConfirmEventType,
  ConfirmationService,
  MessageService,
} from "primeng/api";
import { ProductService } from "src/app/product.service";
import { CartDetailCustomerService } from "src/app/service/cartdetailcustom.service";
import { OrderService } from "src/app/service/order.service";
import { PayService } from "src/app/service/pay.service";

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

  fullName: string = "";
  phoneNumber: string = "";
  emailAddress: string = "";
  homeAddress: string = "";
  user: any;
  arrSanPham: string;
  arrQuantity: string;
  formOrder: any;
  paymentMethod: number = 1;

  constructor(
    private cartDetailCustomerService: CartDetailCustomerService,
    private payService: PayService,
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.checkCartDetailCustom =
      this.cartDetailCustomerService.getCartDetailCustomerService();
    console.log(this.checkCartDetailCustom);
    this.getAccount();
  }

  ngOnInit() {
    this.checkCartDetailCustom.map((c) => {
      this.totalPrice =
        c.discountmethod === 1
          ? this.totalPrice + (c.price - c.discountamount_1_2) * c.quantity
          : c.discountmethod === 2
          ? this.totalPrice +
            (c.price - (c.price * c.discountamount_1_2) / 100) * c.quantity
          : c.discountmethod === 3
          ? this.totalPrice + (c.price - c.discountamount_3_4) * c.quantity
          : this.totalPrice +
            (c.price - (c.price * c.discountamount_3_4) / 100) * c.quantity;
    });
    this.totalPayment = this.totalPrice * 1.08;
  }

  getAccount() {
    this.http.get("http://localhost:8088/api/account").subscribe((response) => {
      console.log("Response:", response);
      this.user = response;
    });
  }

  updateShippingCost(cost: number) {
    this.totalPayment = this.totalPrice * 1.08 + this.shippingCost; // Cập nhật tổng giá
  }

  payment() {
    if (this.paymentMethod == 1) {
      this.saveOrder();
    } else {
      this.arrSanPham = this.checkCartDetailCustom
        .map((any) => any.id)
        .join("a");
      this.arrQuantity = this.checkCartDetailCustom
        .map((any) => any.quantity)
        .join("b");
      this.payService
        .createPayment(
          this.totalPayment,
          this.fullName,
          this.phoneNumber,
          this.emailAddress,
          this.homeAddress,
          this.shippingCost,
          this.user.id,
          this.arrSanPham,
          this.arrQuantity
        )
        .subscribe((response) => {
          window.location.href = response;
        });
    }
  }
  getTotalPrice() {
    let totalPrice = 0;
    for (let cart of this.checkCartDetailCustom) {
      totalPrice += cart.price * cart.quantity;
    }
    return totalPrice;
  }
  getOrderDetailsList() {
    let orderDetailsList = [];
    for (let cart of this.checkCartDetailCustom) {
      orderDetailsList.push({
        shoesDetails: {
          id: cart.shoesdetailid,
        },
        price: cart.price,
        brand: cart.idb,
        quantity: cart.quantity,
        status: 1,
      });
    }
    return orderDetailsList;
  }
  initOrderValue() {
    this.formOrder = {
      receivedBy: this.fullName,
      phone: this.phoneNumber,
      address: this.homeAddress,
      paymentMethod: this.paymentMethod,
      paymentStatus: 2,
      totalPrice: this.getTotalPrice(),
      status: 1,
      owner: {
        id: this.user.id,
      },
      orderDetailsDTOList: this.getOrderDetailsList(),
    };
  }
  saveOrder() {
    this.initOrderValue();
    this.orderService.saveOrder(this.formOrder).subscribe(
      (res) => {
        this.messageService.add({
          severity: "success",
          summary: "Thanh toán thành công",
          life: 3000,
        });
        this.router.navigate(["/client/pay-success"]);
      },
      (error) => {
        console.log(error);
        this.messageService.add({
          severity: "error",
          summary: "Lỗi",
          detail: error.error.fieldErrors
            ? error.error.fieldErrors[0].message
            : error.error.title,
        });
      }
    );
  }
}
