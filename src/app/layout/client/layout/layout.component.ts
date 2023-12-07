import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
} from "@angular/core";
import { CartDetailCustomerService } from "src/app/service/cartdetailcustom.service";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.css"],
})
export class LayoutComponent implements AfterContentChecked {
  dataFromChild: string;

  constructor(
    private cartDetailCustomerService: CartDetailCustomerService,
    private cdr: ChangeDetectorRef
  ) {
    this.cartDetailCustomerService
      .getData()
      .subscribe((data) => (this.dataFromChild = data));
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }
}
