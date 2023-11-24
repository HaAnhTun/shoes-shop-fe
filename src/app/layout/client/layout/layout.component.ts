import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { CartDetailCustomerService } from "src/app/service/cartdetailcustom.service";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.css"],
})
export class LayoutComponent {
  dataFromChild: string;
  private subscription: Subscription;

  constructor(private cartDetailCustomerService: CartDetailCustomerService) {
    this.subscription = this.cartDetailCustomerService
      .getData()
      .subscribe((data) => (this.dataFromChild = data));
  }
}
