import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Order } from "src/app/model/Order";
import { AddressService } from "src/app/service/address.service";
import { OrderService } from "src/app/service/order.service";

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.component.html",
  styleUrls: ["./order-details.component.css"],
})
export class OrderDetailsComponent implements OnInit {
  order: any;
  orderId: number;
  provine: string = "";
  district: string = "";
  ward: string = "";
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private addressService: AddressService
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get("id"));
    this.orderService.getOrder(this.orderId).subscribe((res) => {
      this.order = res;
      console.log(res);
      this.getProvine(this.order.userAddress.province);
      this.getDistrict(this.order.userAddress.district);
      this.getWard(this.order.userAddress.ward);
    });
  }

  getProvine(code: number) {
    this.addressService.getProvine(code).subscribe((res) => {
      this.provine = res.name;
      console.log(res);
    });
  }
  getDistrict(code: number) {
    this.addressService.getDistrict1(code).subscribe((res) => {
      this.district = res.name;
    });
  }
  getWard(code: number) {
    this.addressService.getWard(code).subscribe((res) => {
      this.ward = res.name;
    });
  }
}
