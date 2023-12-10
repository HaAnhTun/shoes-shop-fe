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
import { UserDataService } from "src/app/service/user-data.service";

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
  tax: number = 0;

  fullName: string = "";
  phoneNumber: string = "";
  emailAddress: string = "";
  homeAddress: string = "";
  user: any;
  arrSanPham: string;
  arrQuantity: string;
  formOrder: any;
  paymentMethod: number = 1;
  shoesInCart: any

  constructor(
    private cartDetailCustomerService: CartDetailCustomerService,
    private payService: PayService,
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private productService: ProductService,
    private router: Router,
    private orderService: OrderService,
    private userDataService: UserDataService
  ) {
    this.checkCartDetailCustom =
      this.cartDetailCustomerService.getCartDetailCustomerService();
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
    this.tax = this.totalPrice * 0.08;
    this.totalPayment = this.totalPrice + this.tax;
    if (sessionStorage.getItem("access_token") != null) {
      this.http
        .get("http://localhost:8088/api/account")
        .subscribe((response: any) => {
          this.user = response;
          if (this.user != null) {
            console.log("hihi");
            console.log(this.user);
            this.fullName = this.user.lastName + " " + this.user.firstName;
            this.emailAddress = this.user.email;
          }
        });
    }
    console.log(this.checkCartDetailCustom)
  }

  updateShippingCost(cost: number) {
    this.tax = (this.totalPrice + this.shippingCost) * 0.08;
    this.totalPayment = this.totalPrice + this.shippingCost + this.tax; // Cập nhật tổng giá
  }

  payment() {
    if (this.paymentMethod == 1) {
      this.saveOrder();
    } else {
      let idUser = null;
      if (this.user != null) {
        idUser = this.user.id;
      }else {
        idUser = 'null'
      }
      this.arrSanPham = this.checkCartDetailCustom
        .map((any) => any.shoesdetailid)
        .join("a");
      this.shoesInCart = this.checkCartDetailCustom.map((any) => any.shoesdetailid);
      sessionStorage.setItem(
        "shoesInCart",
        JSON.stringify(
          this.shoesInCart
        )
      );

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
          idUser,
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
