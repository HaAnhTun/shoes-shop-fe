import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
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
import { Location } from "@angular/common";
import { AddressService } from "src/app/service/address.service";

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
  paymentMethod: number = -1;
  shoesInCart: any;
  checkAddress: boolean = true;

  selectedProvince: any;
  selectedDistrict: any;
  selectedWard: any;
  filteredProvinces: any[] = [];
  filteredDistricts: any[] = [];
  filteredWard: any[] = [];

  provines: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  province: any;
  district: any;
  ward: any;

  orderId: number;

  constructor(
    private cartDetailCustomerService: CartDetailCustomerService,
    private payService: PayService,
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private productService: ProductService,
    private router: Router,
    private orderService: OrderService,
    private userDataService: UserDataService,
    private location: Location,
    private route: ActivatedRoute,
    private addressService: AddressService
  ) {
    this.checkCartDetailCustom =
      this.cartDetailCustomerService.getCartDetailCustomerService();
    this.orderId = Number(this.route.snapshot.paramMap.get("id"));
  }

  ngOnInit() {
    if (
      this.checkCartDetailCustom.length === 0 &&
      sessionStorage.getItem("shoesDetailInOder") != null
    ) {
      let cartDetailCustoms = sessionStorage.getItem("shoesDetailInOder");
      if (cartDetailCustoms) {
        let datas = JSON.parse(cartDetailCustoms);
        this.checkCartDetailCustom = datas;
      }
    }
    this.checkCartDetailCustom.map((c) => {
      this.totalPrice =
        c.discountmethod === 1
          ? this.totalPrice + (c.price - c.discountamount_1_2) * c.quantity
          : c.discountmethod === 2
          ? this.totalPrice +
            (c.price - (c.price * c.discountamount_1_2) / 100) * c.quantity
          : c.discountmethod === 3
          ? this.totalPrice + (c.price - c.discountamount_3_4) * c.quantity
          : c.discount_amount === 4
          ? this.totalPrice +
            (c.price - (c.price * c.discountamount_3_4) / 100) * c.quantity
          : this.totalPrice + c.price * c.quantity;
    });
    this.totalPayment = this.totalPrice;
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
            this.phoneNumber = this.user.phone;
          }
        });
    }
    this.addressService.getProvines().subscribe((res) => {
      this.provines = res.results;
    });
  }

  updateShippingCost(cost: number) {
    this.tax = (this.totalPrice + this.shippingCost);
    console.log(this.tax);
    this.totalPayment = this.totalPrice + this.shippingCost; // Cập nhật tổng giá
  }

  payment() {
    console.log(this.homeAddress);
    if (
      this.homeAddress == "" ||
      this.province == null ||
      this.district == null ||
      this.ward == null
    ) {
      this.messageService.add({
        severity: "warn",
        summary: "Cảnh báo",
        detail: "Vui lòng nhập địa chỉ trước khi thanh toán.",
        life: 3000,
      });
    } else {
      if (this.shippingCost != 0) {
        if (this.paymentMethod == 1) {
          this.saveOrder();
        } else if (this.paymentMethod == 2) {
          let idUser = null;
          if (this.user != null) {
            idUser = this.user.id;
          } else {
            idUser = "null";
          }
          this.arrSanPham = this.checkCartDetailCustom
            .map((any) => any.shoesdetailid)
            .join("a");
          this.shoesInCart = this.checkCartDetailCustom.map(
            (any) => any.shoesdetailid
          );
          sessionStorage.setItem(
            "shoesInCart",
            JSON.stringify(this.shoesInCart)
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
              this.province.province_id,
              this.district.district_id,
              this.ward.ward_id,
              this.shippingCost,
              idUser,
              this.arrSanPham,
              this.arrQuantity
            )
            .subscribe((response) => {
              window.location.href = response;
            });
        } else {
          this.messageService.add({
            severity: "warn",
            summary: "Cảnh báo",
            detail: "Bạn chưa chọn phương thức thanh toán.",
            life: 3000,
          });
        }
      } else {
        this.messageService.add({
          severity: "warn",
          summary: "Cảnh báo",
          detail: "Bạn chưa chọn phương thức giao hàng.",
          life: 3000,
        });
      }
    }
  }

  cancel() {
    this.location.back();
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
      mailAddress: this.emailAddress,
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

  filterProvine(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.provines as any[]).length; i++) {
      let provine = (this.provines as any[])[i];
      if (
        provine.province_name.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(provine);
      }
    }

    this.filteredProvinces = filtered;
  }

  filterDistrict(event: any) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.districts as any[]).length; i++) {
      let district = (this.districts as any[])[i];
      if (
        district.district_name.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(district);
      }
    }
    this.filteredDistricts = filtered;
  }

  filterWard(event: any) {
    let filtered: any[] = [];
    let query = event.query;
    console.log(this.wards);
    for (let i = 0; i < (this.wards as any[]).length; i++) {
      let ward = (this.wards as any[])[i];
      if (ward.ward_name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(ward);
      }
    }
    this.filteredWard = filtered;
  }

  changeWard(event: any) {
    this.ward = event;
  }

  getDistrict(event: any) {
    this.province = event;
    this.addressService.getDistrict1(event.province_id).subscribe((res) => {
      this.districts = res.results;
      console.log(this.districts);
    });
  }
  getWard(event: any) {
    this.district = event;
    this.addressService.getWard(event.district_id).subscribe((res) => {
      this.wards = res.results;
    });
  }
}
