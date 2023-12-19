import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
import { PrimeNGConfig, SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { SelectButton } from 'primeng/selectbutton';
import { Slider } from 'primeng/slider';
import { AppConstants } from 'src/app/app-constants';
import { Product } from 'src/app/model/Product';

@Component({
  selector: "app-shop",
  templateUrl: "./shop.component.html",
  styleUrls: ["./shop.component.css"],
})
export class ShopComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  valuee: any;
  layout: 'list' | 'grid' = 'grid';
  @ViewChild('dv') dataView: DataView
  @ViewChild('tablos') testSB: SelectButton
  @ViewChild('sl') sl: Slider
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
  rangeValues: number[] = [0, 10000000];
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
    // Tạo đối tượng SearchSDsResponse để chuyển thành JSON
    const searchData = {
      sizeIds: this.selectedSizes != null ? this.selectedSizes : [], // Thay thế bằng dữ liệu thực tế hoặc để []
      brandId: this.selectedBrand ? this.selectedBrand : null, // Thay thế bằng dữ liệu thực tế hoặc để null
      startPrice: this.rangeValues[0], // Thay thế bằng dữ liệu thực tế ví dụ 0
      endPrice: this.rangeValues[1], // 
    };
    // Gửi yêu cầu POST
    this.http
      .post<any>("http://localhost:8088/api/shoes-details/shop", searchData)
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

  clearFilter() {
    this.selectedSizes = [];
    this.selectedBrand = null;
    this.rangeValues = [0, 10000000];
    this.fetchProducts();
  }

  calle() {
    console.log(this.shoeSizes);
    console.log(this.selectedSizes);
    console.log(this.selectedBrand);
    const searchData = {
      sizeIds: this.selectedSizes,
      brandId: this.selectedBrand, // Thay thế bằng dữ liệu thực tế
      startPrice: this.rangeValues[0], // Thay thế bằng dữ liệu thực tế
      endPrice: this.rangeValues[1], // Thay thế bằng dữ liệu thực tế
    };
    console.log(searchData);
  }
  calle2() {
    console.log(this.selectedBrand);
  }
  loge() {
    console.log(this.rangeValues);
  }
}
