import { HttpClient } from "@angular/common/http";
import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { SelectItem, PrimeNGConfig } from "primeng/api";
import { DataView } from "primeng/dataview";
import { SelectButton } from "primeng/selectbutton";
import { AppConstants } from "src/app/app-constants";
import { Product } from "src/app/model/Product";

@Component({
  selector: "app-discount-shoes",
  templateUrl: "./discount-shoes.component.html",
  styleUrls: ["./discount-shoes.component.css"],
})
export class DiscountShoesComponent {
  products: Product[] = [];
  valuee: any;
  layout: "list" | "grid" = "grid";
  @ViewChild("dv") dataView: DataView;
  @ViewChild("tablos") testSB: SelectButton;
  sortOptions: SelectItem[];
  brandOptions: any[] = [];
  selectedBrand: any;
  sortOrder: number;
  items = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    // Add more items as needed
  ];
  shoeSizes: any[];
  selectedSizes!: any;
  paymentOptions: any[] = [];
  rangeValues: number[] = [100000, 100000000];
  selectedItems: any[] = [];
  sortField: string;
  brands: any[] = [];
  constructor(
    private http: HttpClient,
    private primeNGConfig: PrimeNGConfig,
    private router: Router
  ) {
    this.primeNGConfig.ripple = true;
  }
  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf("!") === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  navigateToRoute(product: any) {
    const queryParams = {
      shid: product.shoes_id,
      brid: product.brand_id,
      siid: product.size_id,
      clid: product.color_id,
      list: [1, 2, 3],
    };
    console.log(queryParams);

    this.router.navigate(["/client/shoes-detail"], {
      queryParams: queryParams,
    });
  }

  ngAfterViewInit(): void {
    let paging = { first: 0, rows: 12 };
    this.dataView.paginate(paging);
  }

  ngOnInit() {
    this.fetchProducts();
    this.sortOptions = [
      { label: "Giá từ cao tới thấp", value: "!price" },
      { label: "Giá từ thấp tới cao", value: "price" },
      { label: "Tên từ A -> Z", value: "!name" },
      { label: "Tên từ Z -> A", value: "name" },
    ];

    this.http
      .get<any>(AppConstants.BASE_URL_API + "/api/sizes")
      .subscribe((response) => {
        this.shoeSizes = response;
        this.shoeSizes.forEach((brand) =>
          this.paymentOptions.push({ name: brand.name, value: brand.id })
        );
        this.selectedSizes = null;
      });
    this.http
      .get<any>(AppConstants.BASE_URL_API + "/api/brands")
      .subscribe((response) => {
        this.brands = response;
        this.brands.forEach((brand) =>
          this.brandOptions.push({ label: brand.name, value: brand.id })
        );
        this.selectedBrand = null;
      });
  }

  fetchProducts() {
    this.http
      .get<any>("http://localhost:8088/api/shoes-details/discount")
      .subscribe(
        (data) => {
          this.products = data;
          console.log(data);
        },
        (error) => {
          console.error("Error fetching products:", error);
        }
      );
  }

  calle() {
    console.log(this.shoeSizes);
    console.log(this.selectedSizes);
    console.log(this.selectedBrand);
  }
  calle2() {
    console.log(this.selectedBrand);
  }
  loge() {
    console.log(this.rangeValues);
  }
}
