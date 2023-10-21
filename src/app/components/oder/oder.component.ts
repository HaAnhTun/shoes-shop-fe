import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Product } from "src/app/model/Product";
@Component({
  selector: "app-oder",
  templateUrl: "./oder.component.html",
  styleUrls: ["./oder.component.css"],
})
export class OderComponent implements OnInit {
  listMenuItems: any[] = [];
  listOder: any[] = [];
  indexOder: number = 0;
  check: boolean = false;
  checkOne: boolean = false;
  checkOder: boolean = false;
  checkIndexOder: number = 0;
  checkString: String = "";
  products: Product[] = [];
  chartData: any[] | undefined;
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.fetchProducts();
    this.check = true;
    this.checkString = "Chờ xác nhận";
    this.listMenuItems = [
      "Chờ xác nhận",
      "Chờ giao",
      "Đang giao",
      "Hoàn thành",
      "Hủy",
      "Chờ thanh toán",
    ];
  }
  creatOder() {
    this.checkOder = true;
    if (this.listOder.length >= 5) {
      return;
    }
    this.indexOder++;
    this.listOder.push(this.indexOder);
  }
  clickIndexOder(index: number): void {
    this.checkIndexOder = index;
  }
  clickListOder(label: String) {
    if (label.startsWith("Chờ xác nhận")) {
      this.checkString = "Chờ xác nhận";
      this.check = true;
      this.checkOne = false;
    } else if (label.startsWith("Chờ giao")) {
      this.checkString = "Chờ giao";
      this.check = true;
      this.checkOne = false;
    } else if (label.startsWith("Đang giao")) {
      this.checkString = "Đang giao";
      this.check = true;
      this.checkOne = false;
    } else if (label.startsWith("Hoàn thành")) {
      this.checkString = "Hoàn thành";
      this.checkOne = true;
      this.check = false;
    } else if (label.startsWith("Hủy")) {
      this.checkString = "Hủy";
      this.checkOne = true;
      this.check = false;
    } else if (label.startsWith("Chờ thanh toán")) {
      this.checkString = "Chờ thanh toán";
      this.check = true;
      this.checkOne = false;
    }
  }
  fetchProducts(): void {
    this.http.get<Product[]>("http://localhost:3000/products").subscribe(
      (data) => {
        this.products = data;
        this.chartData = this.calculateCategoryCounts(this.products);
        console.log(data);
      },
      (error) => {
        console.error("Error fetching products:", error);
      }
    );
  }
  calculateCategoryCounts(products: Product[]): any {
    const categoryCounts: { [category: string]: number } = {};
    for (const product of products) {
      for (const category of product.categories) {
        const categoryName = category.name;
        if (categoryCounts[categoryName]) {
          categoryCounts[categoryName] += 1;
        } else {
          categoryCounts[categoryName] = 1;
        }
      }
    }

    const chartData = {
      labels: Object.keys(categoryCounts),
      datasets: [
        {
          label: "Category Counts",
          backgroundColor: "#42A5F5",
          data: Object.values(categoryCounts),
        },
      ],
    };

    return chartData;
  }
}
