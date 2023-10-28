import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { LayoutService } from "./service/app.layout.service";

@Component({
  selector: "app-menu",
  templateUrl: "./app.menu.component.html",
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.model = [
      {
        label: "Dashboard",
        items: [
          {
            label: "Dashboard",
            icon: "pi pi-fw pi-home",
            routerLink: ["/admin"],
          }, //không có gì  =  ''
          {
            label: "test cho ae ( home) ",
            icon: "pi pi-fw pi-home",
            routerLink: ["/admin/home"],
          }, //này là home
          {
            label: "test cho ae ( category)",
            icon: "pi pi-fw pi-home",
            routerLink: ["/admin/shoes-category"],
          }, //này là shop check component trong app-routing.ts path 'admin'
          {
            label: "test cho ae ( shop)",
            icon: "pi pi-fw pi-home",
            routerLink: ["/admin/shop"],
          }, //này là shop check component trong app-routing.ts path 'admin'
          {
            label: "test cho ae ( category)",
            icon: "pi pi-fw pi-home",
            routerLink: ["/admin/discount"],
          },
        ],
      },
      {
        label: "Hóa đơn",
        items: [
          {
            label: "Quản lý hóa đơn",
            icon: "pi pi-fw pi-shopping-bag",
            routerLink: ["/admin/oder"],
          },
          {
            label: "Input",
            icon: "pi pi-fw pi-check-square",
            routerLink: ["/uikit/input"],
          },
          {
            label: "Auth",
            icon: "pi pi-fw pi-user",
            items: [
              {
                label: "Login",
                icon: "pi pi-fw pi-sign-in",
                routerLink: ["/auth/login"],
              },
              {
                label: "Error",
                icon: "pi pi-fw pi-times-circle",
                routerLink: ["/auth/error"],
              },
              {
                label: "Access Denied",
                icon: "pi pi-fw pi-lock",
                routerLink: ["/auth/access"],
              },
            ],
          },
        ],
      },
      {
        label: "Sản phẩm",
        items: [
          {
            label: "Sản phẩm",
            icon: "pi pi-fw pi-user",
            items: [
              {
                label: "Sản phẩm",
                icon: "pi pi-fw pi-table",
                routerLink: ["/admin/shoes"],
              },
              {
                label: "Chi Tiết Sản Phẩm",
                icon: "pi pi-fw pi-inbox",
                routerLink: ["/admin/shoes-detail"],
              },
              {
                label: "Access Denied",
                icon: "pi pi-fw pi-lock",
                routerLink: ["/auth/access"],
              },
            ],
          },
          {
            label: "Phân loại sản phẩm",
            icon: "pi pi-fw pi-user",
            items: [
              {
                label: "Login",
                icon: "pi pi-fw pi-sign-in",
                routerLink: ["/auth/login"],
              },
              {
                label: "Error",
                icon: "pi pi-fw pi-times-circle",
                routerLink: ["/auth/error"],
              },
              {
                label: "Access Denied",
                icon: "pi pi-fw pi-lock",
                routerLink: ["/auth/access"],
              },
            ],
          },
          {
            label: "Nhãn hiệu",
            icon: "pi pi-fw pi-user",
            items: [
              {
                label: "Login",
                icon: "pi pi-fw pi-sign-in",
                routerLink: ["/auth/login"],
              },
              {
                label: "Error",
                icon: "pi pi-fw pi-times-circle",
                routerLink: ["/auth/error"],
              },
              {
                label: "Access Denied",
                icon: "pi pi-fw pi-lock",
                routerLink: ["/auth/access"],
              },
            ],
          },
        ],
      },
      {
        label: "Khách hàng",
        items: [
          {
            label: "Khách Hàng",
            icon: "pi pi-fw pi-prime",
            routerLink: ["/utilities/icons"],
          },
        ],
      },
      {
        label: "Giảm giá và vouchers",
        icon: "pi pi-fw pi-briefcase",
        items: [
          {
            label: "Chương trình giảm giá",
            icon: "pi pi-fw pi-globe",
            routerLink: ["/landing"],
          },
          {
            label: "Quản lý voucher",
            icon: "pi pi-fw pi-ticket",
            routerLink: ["/notfound"],
          },
          {
            label: "Empty",
            icon: "pi pi-fw pi-circle-off",
            routerLink: ["/pages/empty"],
          },
        ],
      },
      {
        label: "ORTHER",
        items: [
          {
            label: "Documentation",
            icon: "pi pi-fw pi-question",
            routerLink: ["/documentation"],
          },
        ],
      },
    ];
  }
}
