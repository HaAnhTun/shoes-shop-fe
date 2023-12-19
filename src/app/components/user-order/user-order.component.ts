import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router, RouterLinkActive } from "@angular/router";
import { rejects } from "assert";
import { error, log } from "console";
import { resolve } from "path";
import { Order } from "src/app/model/Order";
import { OrderSearchReq } from "src/app/model/OrderSearchReq";
import { Shoes } from "src/app/model/Shoes";
import { LoginService } from "src/app/service/login.service";
import { OrderService } from "src/app/service/order.service";
import { UserService } from "src/app/service/user.service";
import { ShoesDetail } from "../shoes-detail-add/shoes-detail-add.component";
import { OrderDetals } from "src/app/model/OrderDetails";
import { OrderDetailCustom } from "src/app/model/OrderDetailCustom";
import { AddressService } from "src/app/service/address.service";

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
  orderDetailData: { [orderCode: string]: OrderDetailCustom[] } = {};
  orderQuantity: Map<any, any>;

  provinces: any[] = []
  
  districts: any[] = [];
  wards: any[] = [];
  
  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private loginService: LoginService,
    private http: HttpClient,
    private router: Router,
    private addressService: AddressService
  ) {
    this.listMenuItems = [
      { code: 0, name: "Chờ xác nhận", quantity: 0 },
      { code: 1, name: "Chờ giao", quantity: 0 },
      { code: 2, name: "Đang giao", quantity: 0 },
      { code: 3, name: "Hoàn thành", quantity: 0 },
      { code: -1, name: "Hủy", quantity: 0 },
      { code: 4, name: "Đổi trả", quantity: 0 },
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
  
      // Đảm bảo rằng this.signIn đã được xác định trước khi gọi findByLogin
      if (this.signIn) {
        await this.findByLogin(this.orderSearchReqDTO.status, this.signIn.sub);
      } else {
        console.error("SignIn information is missing");
      }
  
      this.fetchQuantityOrder();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  
    // Gọi getProvines và fetchAddress sau khi các thao tác trước đã hoàn tất
    this.addressService.getProvines().subscribe((res) => {
      this.provinces = res.results;
      // Gọi fetchAddress chỉ khi this.provinces đã được thiết lập
      if (this.order) {
        this.fetchAddress(this.order);
      }
    });
  }

  showOderDetails(id: number) {
    this.router.navigate(["/client/order-details/" + id]);
  }
  showOderReturnDetails(id: number) {
    this.router.navigate(["/client/order-return-details/" + id]);
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
  async findByLogin(status: number, login: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    this.userService.getOrderByStatusAndOwnerLogin(status, login).subscribe(
      (res) => {
        this.order = res;
        console.log(this.order);
        this.fetchAddress(this.order)
        resolve();
      },
      (error) => {
        reject(error);
      }
    );
  });
}

  fetchAddress(list: any[]){
    for(let i = 0; i < list.length; i++){
      this.provinces.forEach(province => {
        if(list[i].userAddress.province == province.province_id){
          list[i].userAddress.provinceName = province.province_name;
          this.addressService.getDistrict1(list[i].userAddress.province).subscribe(
            (res) => {
              this.districts = res.results;
              this.districts.forEach(
                (district) => {
                  if(district.district_id == list[i].userAddress.district){
                    list[i].userAddress.districtName = district.district_name;
                    this.addressService.getWard(list[i].userAddress.district).subscribe(
                      (res) => {
                        this.wards = res.results;
                        this.wards.forEach(
                          (ward) => {
                            if(ward.ward_id == list[i].userAddress.ward){

                              list[i].userAddress.wardName = ward.ward_name;

                            }
                          }
                        )
                      }
                    )
                  }
                }
              )
            }
          )
        }
      });
    }
  }

  fetchDistrict(province_id: number){
    
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
    } else if (label.startsWith("Đổi trả")) {
      this.checkString = "Đổi trả";
      this.orderSearchReqDTO.status = 4;
      this.check = true;
      this.checkOne = false;
    }
    await this.findByLogin(this.orderSearchReqDTO.status, this.signIn.sub);
  }

  getShoes(orderCode: string) {
    this.orderService
      .getOrderDetailByOrderCode(orderCode)
      .subscribe((response) => {
        this.orderDetailData[orderCode] = response;
        console.log(response);
      });
  }
}
