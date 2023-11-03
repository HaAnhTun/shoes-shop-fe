import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Order } from "src/app/model/Order";
import { OrderService } from "src/app/service/order.service";
import { OrderSearchReq } from "src/app/model/OrderSearchReq";
import { AddressService } from "src/app/service/address.service";
@Component({
  selector: "app-oder",
  templateUrl: "./oder.component.html",
  styleUrls: ["./oder.component.css"],
})
export class OderComponent implements OnInit {
  listMenuItems: any[] = [];
  listOder: any[] = [];
  indexOder: number = 0;
  check: boolean = false;
  checkOne: boolean = false;
  checkOder: boolean = false;
  checkIndexOder: number = 0;
  checkString: String = "";
  orderQuantity: Map<any, any>;
  orders: Order[] = [];
  orderSearchReqDTO: OrderSearchReq = {
    status: 0,
  };
  chartData: any[] | undefined;
  cities: any[];
  selectedCity: any;
  districts: any[];
  selectedDistricts: any;
  wards: any[];
  constructor(
    private http: HttpClient,
    private orderService: OrderService,
    private addressService: AddressService
  ) {}
  ngOnInit() {
    this.fetchCities();
    this.fetchQuantityOrder();
    this.fetchOrders();
    this.check = true;
    this.checkString = "Chờ xác nhận";
    this.listMenuItems = [
      { code: 0, name: "Chờ xác nhận", quantity: 0 },
      { code: 1, name: "Chờ giao", quantity: 0 },
      { code: 2, name: "Đang giao", quantity: 0 },
      { code: 3, name: "Hoàn thành", quantity: 0 },
      { code: -1, name: "Hủy", quantity: 0 },
      { code: 4, name: "Chờ thanh toán", quantity: 0 },
    ];
  }
  creatOder() {
    this.checkOder = true;
    if (this.listOder.length >= 5) {
      return;
    }
    this.indexOder++;
    this.listOder.push(this.indexOder);
  }
  clickIndexOder(index: number): void {
    this.checkIndexOder = index;
  }
  clickListOder(label: String) {
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
    this.fetchOrders();
  }
  fetchOrders(): void {
    this.orderService.getOrders(this.orderSearchReqDTO).subscribe(
      (res) => {
        this.orders = res;
      },
      (error) => {}
    );
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
  fetchCities() {
    this.addressService.getProvines().subscribe(
      (res) => {
        this.cities = res;
      },
      (error) => {}
    );
  }
  fetchDistricts() {
    this.addressService.getDistrict(this.selectedCity.code).subscribe(
      (res) => {
        this.districts = res.districts;
      },
      (error) => {}
    );
  }
  fetchWards() {
    this.addressService.getWards(this.selectedDistricts.code).subscribe(
      (res) => {
        this.wards = res.wards;
      },
      (error) => {}
    );
  }
  // calculateCategoryCounts(orders: Order[]): any {
  //   const categoryCounts: { [category: string]: number } = {};
  //   for (const product of orders) {
  //     for (const category of product.categories) {
  //       const categoryName = category.name;
  //       if (categoryCounts[categoryName]) {
  //         categoryCounts[categoryName] += 1;
  //       } else {
  //         categoryCounts[categoryName] = 1;
  //       }
  //     }
  //   }

  //   const chartData = {
  //     labels: Object.keys(categoryCounts),
  //     datasets: [
  //       {
  //         label: "Category Counts",
  //         backgroundColor: "#42A5F5",
  //         data: Object.values(categoryCounts),
  //       },
  //     ],
  //   };

  //   return chartData;
  // }
}
