import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { MenuItem } from "primeng/api";
import { Subscription } from "rxjs";
import { LayoutService } from "src/app/layout/service/app.layout.service";
import { ProductService } from "src/app/product.service";

interface InventoryStatus {
  label: string;
  value: string;
}
interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  inventoryStatus: InventoryStatus;
  category: string;
  image: string;
  rating: number;
}
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent {
  items!: MenuItem[];

  products: any[];

  chartData: any;

  chartOptions: any;

  subscription!: Subscription;

  onlineData: number[];

  offlineData: any[];

  orderNumbers: any;
  revenueOnWeek: any;
  customers: any;
  revenueOnShop: any;
  revenueOnOnline: any;
  bestSellingProduct: any[];

  constructor(private http: HttpClient, public layoutService: LayoutService) {
    this.subscription = this.layoutService.configUpdate$.subscribe(() => {
      this.initChart();
    });
  }

  ngOnInit() {
    this.http
      .get<any>("http://localhost:8088/api/dashboard/revenue-year/on")
      .subscribe((response) => {
        this.onlineData = response;
        this.initChart();
      });
    this.http
      .get<any>("http://localhost:8088/api/dashboard/revenue-year/off")
      .subscribe((response) => {
        this.offlineData = response;
        this.initChart();
      });

    this.http
      .get<any>("http://localhost:8088/api/dashboard/order-number")
      .subscribe((response) => {
        this.orderNumbers = response;
      });
    this.http
      .get<any>("http://localhost:8088/api/dashboard/order-revenue")
      .subscribe((response) => {
        this.revenueOnWeek = response;
      });
    this.http
      .get<any>("http://localhost:8088/api/dashboard/customers")
      .subscribe((response) => {
        this.customers = response;
      });
    this.http
      .get<any>("http://localhost:8088/api/dashboard/order-revenue-on")
      .subscribe((response) => {
        this.revenueOnOnline = response;
      });
    this.http
      .get<any>("http://localhost:8088/api/dashboard/order-revenue-off")
      .subscribe((response) => {
        this.revenueOnShop = response;
      });
    this.http
      .get<any>("http://localhost:8088/api/dashboard/best-selling")
      .subscribe((response) => {
        this.bestSellingProduct = response;
        console.log(this.bestSellingProduct);
      });

    this.items = [
      { label: "Add New", icon: "pi pi-fw pi-plus" },
      { label: "Remove", icon: "pi pi-fw pi-minus" },
    ];
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    this.chartData = {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "Doanh thu online",
          data: this.onlineData,
          fill: false,
          backgroundColor: documentStyle.getPropertyValue("--bluegray-700"),
          borderColor: documentStyle.getPropertyValue("--bluegray-700"),
          tension: 0.1,
        },
        {
          label: "Doanh Thu offline",
          data: this.offlineData,
          fill: false,
          backgroundColor: documentStyle.getPropertyValue("--green-600"),
          borderColor: documentStyle.getPropertyValue("--green-600"),
          tension: 0.1,
        },
      ],
    };

    this.chartOptions = {
      plugins: {
        title: {
          display: true,
          text: "Doanh thu năm",
        },
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      //   scales: {
      //       x: {
      //           display: true,
      //           ticks: {
      //               color: textColorSecondary
      //           },
      //           grid: {
      //               color: surfaceBorder,
      //               drawBorder: false
      //           }
      //       },
      //       y: {
      //           display: true,
      //           ticks: {
      //               color: textColorSecondary
      //           },
      //           grid: {
      //               color: surfaceBorder,
      //               drawBorder: false
      //           }
      //       }
      //   }
    };
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
