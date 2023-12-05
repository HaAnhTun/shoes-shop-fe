import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router, RouterLinkActive } from "@angular/router";
import { rejects } from "assert";
import { error, log } from "console";
import { resolve } from "path";
import { Order } from "src/app/model/Order";
import { OrderSearchReq } from "src/app/model/OrderSearchReq";
import { LoginService } from "src/app/service/login.service";
import { OrderService } from "src/app/service/order.service";
import { UserService } from "src/app/service/user.service";

@Component({
  selector: "app-user-order",
  templateUrl: "./user-order.component.html",
  styleUrls: ["./user-order.component.css"],
})
export class UserOrderComponent implements OnInit {
  order: Order[] = [];
  user: any;
  signIn: any;
  check: boolean = false;
  checkOne: boolean = false;
  checkOder: boolean = false;
  checkIndexOder: number = 0;
  checkString: String = "";
  listMenuItems: { code: number; name: string; quantity: number }[];
  orderSearchReqDTO: OrderSearchReq = {
    status: 0,
  };
  orderQuantity: Map<any, any>;
  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private loginService: LoginService,
    private http: HttpClient,
    private router: Router
  ) {
    this.listMenuItems = [
      { code: 0, name: "Chờ xác nhận", quantity: 0 },
      { code: 1, name: "Chờ giao", quantity: 0 },
      { code: 2, name: "Đang giao", quantity: 0 },
      { code: 3, name: "Hoàn thành", quantity: 0 },
      { code: -1, name: "Hủy", quantity: 0 },
      { code: 4, name: "Chờ thanh toán", quantity: 0 },
    ];
  }

  async ngOnInit(): Promise<void> {
    try {
      const token = sessionStorage.getItem("access_token");
      if (token !== null) {
        this.signIn = this.loginService.decodeJwtToken(token);
      } else {
        console.error("Access token is null");
      }
      this.findByLogin(this.orderSearchReqDTO.status, this.signIn.sub);
    } catch (error) {
      console.error("An error occurred:", error);
    }
    this.fetchQuantityOrder();
  }
  showOderDetails(id: number) {
    this.router.navigate(["/client/order-details/" + id]);
  }
  returnOrder(id: number) {
    this.router.navigate(["/client/return-order/" + id]);
  }
  fetchQuantityOrder(): void {
    this.http
      .get("http://localhost:8088/api/orders/quantity")
      .subscribe((res) => {
        this.orderQuantity = new Map(Object.entries(res));
        for (let i = 0; i < this.listMenuItems.length; i++) {
          if (this.orderQuantity.has(this.listMenuItems[i].code + ""))
            this.listMenuItems[i].quantity = this.orderQuantity.get(
              this.listMenuItems[i].code + ""
            );
        }
      });
  }
  findByLogin(status: number, login: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.userService.getOrderByStatusAndOwnerLogin(status, login).subscribe(
        (res) => {
          this.order = res;
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async clickListOder(label: String) {
    if (label.startsWith("Chờ xác nhận")) {
      this.checkString = "Chờ xác nhận";
      this.orderSearchReqDTO.status = 0;
      this.check = true;
      this.checkOne = false;
    } else if (label.startsWith("Chờ giao")) {
      this.checkString = "Chờ giao";
      this.orderSearchReqDTO.status = 1;
      this.check = true;
      this.checkOne = false;
    } else if (label.startsWith("Đang giao")) {
      this.checkString = "Đang giao";
      this.orderSearchReqDTO.status = 2;
      this.check = true;
      this.checkOne = false;
    } else if (label.startsWith("Hoàn thành")) {
      this.checkString = "Hoàn thành";
      this.orderSearchReqDTO.status = 3;
      this.checkOne = true;
      this.check = false;
    } else if (label.startsWith("Hủy")) {
      this.checkString = "Hủy";
      this.orderSearchReqDTO.status = -1;
      this.checkOne = true;
      this.check = false;
    } else if (label.startsWith("Chờ thanh toán")) {
      this.checkString = "Chờ thanh toán";
      this.orderSearchReqDTO.status = 4;
      this.check = true;
      this.checkOne = false;
    }
    await this.findByLogin(this.orderSearchReqDTO.status, this.signIn.sub);
  }
}
