import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { LayoutService } from "./service/app.layout.service";

@Component({
  selector: "app-menu",
  templateUrl: "./app.menu.component.html",
  styleUrls: ["./app.menu.component.css"],
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
            label: "Thống kê",
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
            routerLink: ["/admin/orders"],
          },
          {
            label: "Quản lý dổi trả",
            icon: "pi pi-fw pi-shopping-bag",
            routerLink: ["/admin/order-returns"],
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
                label: "Chi Tiết Sản Phẩm",
                icon: "pi pi-fw pi-inbox",
                routerLink: ["/admin/shoes-detail"],
              },
            ],
          },
          {
            label: "Giày",
            icon: "pi pi-fw pi-server",
            items: [
              {
                label: "Giày",
                icon: "pi pi-fw pi-table",
                routerLink: ["/admin/shoes"],
              },
              {
                label: "Giày đã xóa",
                icon: "pi pi-fw pi-circle-fill",
                routerLink: ["/admin/removedShoes"],
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
              },
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
              },
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
              },
            ],
          },
        ],
      },
      {
        label: "Khách hàng",
        items: [
          {
            label: "Quản lý đánh giá",
            icon: "pi pi-fw pi-users",
            routerLink: ["/admin/feedback"],
          },
        ],
      },
      {
        label: "Tài khoản",
        items: [
          {
            label: "Tài khoản",
            icon: "pi pi-fw pi-users",
            routerLink: ["/admin/users"],
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
