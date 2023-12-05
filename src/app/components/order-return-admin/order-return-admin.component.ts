import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormArray, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import {
  ConfirmEventType,
  ConfirmationService,
  MessageService,
} from "primeng/api";
import { TabView } from "primeng/tabview";
import { Order } from "src/app/model/Order";
import { OrderDetals } from "src/app/model/OrderDetails";
import { OrderSearchReq } from "src/app/model/OrderSearchReq";
import { Product } from "src/app/model/Product";
import { ProductService } from "src/app/product.service";
import { AddressService } from "src/app/service/address.service";
import { OrderService } from "src/app/service/order.service";
import { ShoesDetail } from "../shoes-detail-add/shoes-detail-add.component";

@Component({
  selector: "app-order-return-admin",
  templateUrl: "./order-return-admin.component.html",
  styleUrls: ["./order-return-admin.component.css"],
})
export class OrderReturnAdminComponent implements OnInit {
  listMenuItems: any[] = [];
  listOderReturn: any[] = [];
  indexOder: number = 0;
  check: boolean = false;
  checkOne: boolean = false;
  checkOder: boolean = false;
  checkIndexOder: number = 0;
  checkString: String = "";
  orderQuantity: Map<any, any>;
  orderSearchReqDTO: OrderSearchReq = {
    status: 1,
  };
  reset: boolean = true;
  constructor(
    private orderService: OrderService,
    private addressService: AddressService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private productService: ProductService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchQuantityOrder();
    this.fetchOrders();
    this.check = true;
    this.checkString = "Chờ xác nhận";
    this.listMenuItems = [
      { code: 1, name: "Chờ xác nhận", quantity: 0 },
      { code: 2, name: "Đang xử lý", quantity: 0 },
      { code: 3, name: "Hoàn thành", quantity: 0 },
      { code: 4, name: "Hủy", quantity: 0 },
    ];
  }
  clickIndexOder(index: number): void {
    this.checkIndexOder = index;
  }
  clickListOder(label: String) {
    if (label.startsWith("Chờ xác nhận")) {
      this.checkString = "Chờ xác nhận";
      this.orderSearchReqDTO.status = 1;
      this.check = true;
      this.checkOne = false;
    } else if (label.startsWith("Hoàn thành")) {
      this.checkString = "Hoàn thành";
      this.orderSearchReqDTO.status = 3;
      // this.checkOne = true;
      this.check = true;
    } else if (label.startsWith("Đang xử lý")) {
      this.checkString = "Đang xử lý";
      this.orderSearchReqDTO.status = 2;
      // this.checkOne = true;
      this.check = true;
    } else{
      this.checkString = "Hủy";
      this.orderSearchReqDTO.status = 4;
      // this.checkOne = true;
      this.check = true;
    }
    this.fetchOrders();
  }
  cancelOrderReturn(id:number){
    
    this.http.get("http://localhost:8088/api/order-returns/cancel/" + id).subscribe((res)=>{
      console.log(res);
      this.fetchOrders();
    })
    
  }
  finish(id:number){
    this.http.get("http://localhost:8088/api/order-returns/finish/" + id).subscribe((res)=>{
      console.log(res);
      this.fetchOrders();
    })
    
  }
  visible = false;
  updateVisibility(): void {
    this.visible = false;
    setTimeout(() => (this.visible = true), 0);
  }
  fetchOrders(): void {
    this.http
      .post(
        "http://localhost:8088/api/order-returns/search",
        this.orderSearchReqDTO
      )
      .subscribe(
        (res) => {
          this.listOderReturn = res as any[];
        },
        (error) => {}
      );
      this.updateVisibility()
  }
  fetchQuantityOrder(): void {
    this.orderService.getOrderQuantity().subscribe((res) => {
      this.orderQuantity = new Map(Object.entries(res));
      for (let i = 0; i < this.listMenuItems.length; i++) {
        if (this.orderQuantity.has(this.listMenuItems[i].code + ""))
          this.listMenuItems[i].quantity = this.orderQuantity.get(
            this.listMenuItems[i].code + ""
          );
      }
    });
  }
  showOrderReturnDetails(id: number) {
    this.router.navigate(["/admin/order-return-details/" + id]);
  }
  updateTable() {}
}
