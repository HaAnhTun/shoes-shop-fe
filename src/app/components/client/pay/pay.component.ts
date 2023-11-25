import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { CartDetailCustomerService } from "src/app/service/cartdetailcustom.service";
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

  fullName: string = '';
  phoneNumber: string = '';
  emailAddress: string = '';
  homeAddress: string = '';
  user: any;
  arrSanPham: string;
  arrQuantity: string;

  constructor(
    private cartDetailCustomerService: CartDetailCustomerService,
    private payService: PayService,
    private http: HttpClient
  ) {
    this.checkCartDetailCustom = this.cartDetailCustomerService.getCartDetailCustomerService();

    this.getAccount();
  }

  ngOnInit() {
    this.checkCartDetailCustom.map((customer) => {
      this.totalPrice = this.totalPrice + customer.price * customer.quantity;
    });
    this.totalPayment = this.totalPrice*1.08
  }

  getAccount() {
    this.http.get('http://localhost:8088/api/account').subscribe(
      (response) => {
        console.log('Response:', response);
        this.user = response;
      },
    );
  }
  
  updateShippingCost(cost: number) {
    this.totalPayment = this.totalPrice + this.shippingCost; // Cập nhật tổng giá
  }


  payment(){
    this.arrSanPham = this.checkCartDetailCustom.map(any => any.id).join('a')
    this.arrQuantity = this.checkCartDetailCustom.map(any => any.quantity).join('b')
    this.payService.createPayment(
      this.totalPayment, 
      this.fullName, 
      this.phoneNumber, 
      this.emailAddress, 
      this.homeAddress, 
      this.shippingCost, 
      this.user.id, 
      this.arrSanPham, 
      this.arrQuantity
      ).subscribe(
        (response) => {
          window.location.href = response;
        }
    )
  }  
}
