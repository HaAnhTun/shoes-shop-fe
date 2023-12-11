import { Component, OnInit } from "@angular/core";
import { LayoutService } from "src/app/layout/service/app.layout.service";
import { LoginService } from "src/app/service/login.service";
import { Router } from "@angular/router";
import { ShoesdetailService } from "src/app/service/shoesdetail.service";
import { ShoesDetailCustom } from "src/app/model/ShoesDetailCustom";
import { CartDetailService } from "src/app/service/cart-detail.service";
import { CartDetailCustomerService } from "src/app/service/cartdetailcustom.service";

@Component({
  selector: "app-client.home",
  templateUrl: "./client.home.component.html",
  styleUrls: ["./client.home.component.css"],
})
export class ClientHomeComponent implements OnInit {
  shoesDetailCustom: ShoesDetailCustom[];
  constructor(
    public layoutService: LayoutService,
    private loginService: LoginService,
    private router: Router,
    private shoesdetailService: ShoesdetailService,
    private cartDetailService: CartDetailService,
    private cartDetailCustomerService: CartDetailCustomerService
  ) {}
  ngOnInit(): void {
    if (
      sessionStorage.getItem("access_token") == null &&
      sessionStorage.getItem("oathu2") != null
    ) {
      this.loginService.ouath2().subscribe({
        next: (body: any) => {
          if (body && body?.id_token) {
            sessionStorage.setItem("access_token", body?.id_token);
            this.cartDetailService.getCount().subscribe((Response) => {
              this.cartDetailCustomerService.setData(Response);
            });
          }
        },
      });
    }
    this.shoesdetailService.getNewShoesDetail().subscribe((response) => {
      this.shoesDetailCustom = response;
    });
  }

  shoesDetail(shoesDetail: ShoesDetailCustom) {
    const queryParams = {
      shid: shoesDetail.idsh,
      brid: shoesDetail.idb,
      siid: shoesDetail.idsz,
      clid: shoesDetail.idc,
    };

    this.router.navigate(["/client/shoes-detail"], {
      queryParams: queryParams,
    });
  }
}
