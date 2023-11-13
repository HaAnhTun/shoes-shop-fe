import { Component, OnInit } from "@angular/core";
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
  constructor(private cartDetailService: CartDetailService) {}
  ngOnInit() {
    this.cartDetailService.getAllCartDetail().subscribe((Response) => {
      this.cartDetails = Response;
      this.cartDetails.forEach(
        (c) => (this.totalQuanity = this.totalQuanity + c.quantity)
      );
    });
  }
}
