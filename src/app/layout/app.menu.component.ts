import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { LayoutService } from "./service/app.layout.service";

@Component({
  selector: "app-menu",
  templateUrl: "./app.menu.component.html",
  styleUrls: ["./app.menu.component.css"]
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) { }

  ngOnInit() {
    this.model = [
      {
        label: "Dashboard",
        items: [
          {
            label: "Dashboard",
            icon: "pi pi-fw pi-home",
            routerLink: ["/admin"],
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

        ],
      },
      {
        label: "Sản phẩm",
        items: [
          {
            label: "Sản phẩm",
            icon: "pi pi-fw pi-table",
            items: [
              {
                label: "Giày",
                icon: "pi pi-fw pi-table",
                routerLink: ["/admin/shoes"],
              },
              {
                label: "Chi Tiết Sản Phẩm",
                icon: "pi pi-fw pi-inbox",
                routerLink: ["/admin/shoes-detail"],
              },
            ],
          },
          {
            label: "Phân loại sản phẩm",
            icon: "pi pi-fw pi-tag",
            items: [
              {
                label: "Categories (testing)",
                icon: "pi pi-fw pi-sign-in",
                routerLink: ["/admin/shoes-category"],
              },
            ],
          },
          {
            label: "Nhãn hiệu",
            icon: "pi pi-fw pi-briefcase",
            items: [
              {
                label: "Nhãn hiệu",
                icon: "pi pi-fw pi-briefcase",
                routerLink: ["/admin/brand"],
              },
              {
                label: "Đã xóa",
                icon: "pi pi-fw pi-circle-fill",
                routerLink: ["/admin/removedBrand"],
              }
            ],
          },
          {
            label: "Màu sắc",
            icon: "pi pi-fw pi-circle-fill",
            items: [
              {
                label: "Màu sắc",
                icon: "pi pi-fw pi-circle-fill",
                routerLink: ["/admin/color"],
              },
              {
                label: "Đã xóa",
                icon: "pi pi-fw pi-circle-fill",
                routerLink: ["/admin/removedColor"],
              }
            ],
          },
          {
            label: "Size",
            icon: "pi pi-fw pi-sitemap",
            items: [
              {
                label: "Size",
                icon: "pi pi-fw pi-sitemap",
                routerLink: ["/admin/size"],
              },
              {
                label: "Đã xóa",
                icon: "pi pi-fw pi-circle-fill",
                routerLink: ["/admin/removedSize"],
              }
            ],
          },
        ],
      },
      {
        label: "Khách hàng",
        items: [
          {
            label: "Khách Hàng",
            icon: "pi pi-fw pi-users",
            routerLink: ["/admin/users"],
          },
          {
            label: "Quản lý đánh giá",
            icon: "pi pi-fw pi-users",
            routerLink: ["/admin/feedback"],
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
            routerLink: ["/admin/discount"],
          },
        ],
      },
      {
        label: "Khác",
        items: [
          {
            label: "Tài liệu",
            icon: "pi pi-fw pi-book",
            routerLink: ["/documentation"],
          },
        ],
      },
    ];
  }
}
