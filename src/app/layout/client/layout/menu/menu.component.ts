import { Component, Input, OnInit } from "@angular/core";
import { CartDetailService } from "src/app/service/cart-detail.service";
import { CartDetail } from "src/app/model/CartDetail";
@Component({
  selector: "client-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent implements OnInit {
  cartDetails: CartDetail[];
  totalQuanity: number = 0;
  @Input() quanity: number = 0;
  constructor(private cartDetailService: CartDetailService) {}
  ngOnInit() {
    if (sessionStorage.getItem("access_token") != null) {
      this.cartDetailService.getCount().subscribe((Response) => {
        this.quanity = Response;
      });
    }
  }
}
