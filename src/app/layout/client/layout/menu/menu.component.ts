import { Component, Input, OnInit } from "@angular/core";
import { CartDetailService } from "src/app/service/cart-detail.service";
import { CartDetail } from "src/app/model/CartDetail";
import { CartDetailCustom } from "src/app/model/CartDetailCustom";
import { CartDetailCustomerService } from "src/app/service/cartdetailcustom.service";
@Component({
  selector: "client-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent implements OnInit {
  cartDetails: CartDetail[];
  CartDetailCustoms: CartDetailCustom[] = [];
  totalQuanity: number = 0;
  @Input() quanity: number = 0;
  constructor(private cartDetailService: CartDetailService) {}
  ngOnInit() {
    this.quanity = 0;
    if (sessionStorage.getItem("access_token") != null) {
      this.cartDetailService.getCount().subscribe((Response) => {
        this.quanity = Response;
      });
    }
    if (sessionStorage.getItem("cartDetailCustoms") != null) {
      let cartDetailCustoms = sessionStorage.getItem("cartDetailCustoms");
      if (cartDetailCustoms) {
        let datas = JSON.parse(cartDetailCustoms);
        this.CartDetailCustoms = datas;
        this.quanity = this.CartDetailCustoms.length;
      }
    }
  }
}
