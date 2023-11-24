import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { CartDetailService } from "src/app/service/cart-detail.service";
import { CartDetailSave } from "src/app/model/AddCartDetail";
import { CartDetail } from "src/app/model/CartDetail";
import {
  ConfirmationService,
  MessageService,
  ConfirmEventType,
} from "primeng/api";
import { log } from "console";

export interface ShoesDetail {
  id?: number;
  code: string;
  price: number;
  quantity: number;
  images: string[];
  description: string;
  shoes: {
    id: number;
    name: string;
  };
  brand: {
    id: number;
    name: string;
  };
  color: {
    id: number;
    name: string;
  }[];
  size: {
    id: number;
    name: string;
  }[];
}

@Component({
  selector: "app-shoes-inspect",
  templateUrl: "./shoes-inspect.component.html",
  styleUrls: ["./shoes-inspect.component.css"],
})
export class ShoesInspectComponent {
  CartDetailSave: CartDetailSave = {};
  cartDetails: CartDetail[];
  check: any = null;
  sizeOptions: any[] = [
    { name: "31", value: 1 },
    { name: "32", value: 2 },
    { name: "33", value: 3 },
    { name: "34", value: 4 },
  ];
  selectedsize: any = null;
  colorOptions: any[] = [
    { name: "31", value: 1 },
    { name: "32", value: 2 },
    { name: "33", value: 3 },
    { name: "34", value: 4 },
  ];
  selectedColor: any = null;
  quantity: any = 1;
  visible: boolean = false;
  activeIndex: number = 0;
  shoesDetails: any;
  productId: any | null;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cartDetailService: CartDetailService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.shoesDetails = {
      code: "ABC123",
      price: 50000,
      quantity: 100,
      images: [
        "https://duyhung-bucket.s3.ap-southeast-1.amazonaws.com/images/badcb1487af6c62c6a0cb1487af6c62c6a0Screenshot2023-07-26163607.png",
        "https://tse3.mm.bing.net/th/id/OIP.AjzWApytAwaFTtBLVhLPdwHaHa?w=217&h=217&c=7&r=0&o=5&dpr=1.1&pid=1.7",
        "https://tse3.mm.bing.net/th/id/OIP.AjzWApytAwaFTtBLVhLPdwHaHa?w=217&h=217&c=7&r=0&o=5&dpr=1.1&pid=1.7",
        "https://tse3.mm.bing.net/th/id/OIP.AjzWApytAwaFTtBLVhLPdwHaHa?w=217&h=217&c=7&r=0&o=5&dpr=1.1&pid=1.7",
        "https://tse3.mm.bing.net/th/id/OIP.AjzWApytAwaFTtBLVhLPdwHaHa?w=217&h=217&c=7&r=0&o=5&dpr=1.1&pid=1.7",
      ],
      description:
        "Giày được thiết kế dáng thắt dây năng động,mặt giày sử dụng chất liệu da tổng hợp phối màu,in chữ thời trang Đặc biệt sản phẩm sử dụng chất liệu da cao cấp có độ bền tối ưu giúp bạn thoải mái trong mọi hoàn cảnh.Giày thoáng khí cả mặt trong lẫn mặt ngoài khiến người mang luôn cảm thấy dễ chịu dù hoạt động trong thời gian dài.",
      shoes: {
        id: 1,
        name: "Running Shoes",
      },
      brand: {
        id: 2,
        name: "Nike",
      },
      color: [
        {
          id: 1,
          name: "Red",
        },
        {
          id: 2,
          name: "Blue",
        },
      ],
      size: [
        {
          id: 1,
          name: "US 9",
        },
        {
          id: 2,
          name: "US 10",
        },
      ],
    };
    this.route.queryParams.subscribe((params) => {
      // Access the query parameters inside the subscribe callback
      const shid = params['shid'];
      const brid = params['brid'];
      const siid = params['siid'];
      const clid = params['clid'];
      console.log(params['list']);

      this.productId = { shid: shid, brid: brid, siid: siid, clid: clid }
    });
    this.fetchProductDetails();
  }
  fetchProductDetails() {
    const apiUrl = `http://localhost:8088/api/shoes-details/shop/detail`;
    // Make the HTTP request
    this.http.post<any>(apiUrl, this.productId).subscribe(
      (data: any) => {
        this.shoesDetails = data;
        console.log(data.paths);
        this.shoesDetails.images = this.splitPaths(data.paths);
        this.sizeOptions = this.mergeLists(
          this.splitPaths(this.shoesDetails.size_names),
          this.splitPaths(this.shoesDetails.size_ids)
        );
        console.log(this.sizeOptions.length);
        this.selectedsize = data.size_id
        this.colorOptions = this.mergeLists(this.splitPaths(this.shoesDetails.color_names), this.splitPaths(this.shoesDetails.color_ids))
        this.selectedColor = data.color_id
      },
      (error) => {
        console.error("Error fetching product details:", error);
      }
    );
  }

  onColorChange() {
    this.productId.siid = null;
    this.productId.clid = this.selectedColor
    console.log(this.productId);
    this.fetchProductDetails();
    console.log(this.shoesDetails);
  }

  onSizeChange() {
    this.productId.siid = this.selectedsize;
    this.productId.clid = this.selectedColor
    console.log(this.productId);
    this.fetchProductDetails();
    console.log(this.shoesDetails);
  }

  splitPaths(input: string): any[] {
    const pathsArray = input.split(",");
    const trimmedPaths = pathsArray.map((path) => path.trim());
    return trimmedPaths;
  }

  ale() {
    console.log(this.selectedsize);
  }

  clickAddCart() {
    if (this.selectedColor === null || this.selectedsize === null) {
      this.messageService.add({
        severity: "warn",
        summary: "Thông báo",
        detail: "Bạn vẫn chưa chọn size hoặc color",
        life: 5000,
      });
    } else {
      this.cartDetailService.getAllCartDetail().subscribe((Response) => {
        this.cartDetails = Response;
        this.cartDetails
          .filter((c) => c.shoesDetails.id === this.shoesDetails.id)
          .forEach(
            (c) =>
              (this.check = this.cartDetailService
                .updateQuanity(c.id, this.quantity)
                .subscribe(() => {
                  this.router.navigate(["/client/cart"]);
                }))
          );
        if (this.check === null) {
          this.CartDetailSave.status = 1;
          this.CartDetailSave.quantity = this.quantity;
          this.CartDetailSave.shoesDetails = this.shoesDetails;
          this.cartDetailService
            .saveCartDetail(this.CartDetailSave)
            .subscribe((cartDetail: CartDetail) => {
              this.router.navigate(["/client/cart"]);
            });
        }
      });
    }
  }

  ngOnInit(): void {}

  mergeLists(names: any[], values: any[]): any[] {
    var Options: any[] = [];
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const value = values[i];
      const option = { name: name, value: Number(value) };
      Options.push(option);
    }
    return Options;
  }

  showGuide() {
    this.visible = true;
  }
}
