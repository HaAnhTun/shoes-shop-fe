import { HttpClient, HttpParams } from "@angular/common/http";
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
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CartDetailCustomerService } from "src/app/service/cartdetailcustom.service";
import { CartDetailCustom } from "src/app/model/CartDetailCustom";

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
  cartDetailCustoms: CartDetailCustom[] = [];
  cartDetailCustom: CartDetailCustom;
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
  feedbacks: any[];
  feedback = {
    rate: 0,
    comment: "",
    user: { id: 4 }, // Thay đổi theo ID người dùng thực tế
    shoes: { id: 246 }, // Thay đổi theo ID sản phẩm thực tế
  };
  feedbackForm: FormGroup;
  user: any = null;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cartDetailService: CartDetailService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private cartDetailCustomerService: CartDetailCustomerService
  ) {
    this.getAccount();
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
      const shid = params["shid"];
      const brid = params["brid"];
      const siid = params["siid"];
      const clid = params["clid"];
      this.productId = { shid: shid, brid: brid, siid: siid, clid: clid };
    });
    this.fetchProductDetails();
  }

  getAccount() {
    if (sessionStorage.getItem("access_token") != null) {
      this.http
        .get("http://localhost:8088/api/account")
        .subscribe((response) => {
          console.log("Response:", response);
          this.user = response;
        });
    }
  }

  // Gọi hàm này mỗi khi quantity thay đổi
  onQuantityChange() {
    if (this.quantity >= this.shoesDetails.quantity) {
      this.showMessage();
    }
  }

  showMessage() {
    this.messageService.add({
      severity: "warn",
      summary: "Số Lượng tối đa",
      detail: "Đã đạt giới hạn hàng trong kho",
    });
  }

  fetchProductDetails() {
    const apiUrl = `http://localhost:8088/api/shoes-details/shop/detail`;
    // Make the HTTP request
    this.http.post<any>(apiUrl, this.productId).subscribe(
      (data: any) => {
        this.shoesDetails = data;
        this.shoesDetails.images = this.splitPaths(data.paths);
        this.sizeOptions = this.mergeLists(
          this.splitPaths(this.shoesDetails.size_names),
          this.splitPaths(this.shoesDetails.size_ids)
        );
        this.selectedsize = data.size_id;
        this.colorOptions = this.mergeLists(
          this.splitPaths(this.shoesDetails.color_names),
          this.splitPaths(this.shoesDetails.color_ids)
        );
        this.selectedColor = data.color_id;
        this.getFeedBack(
          this.shoesDetails.shoes_id,
          this.shoesDetails.brand_id
        );
        console.log(data);
      },
      (error) => {
        console.error("Error fetching product details:", error);
      }
    );
  }

  onColorChange() {
    this.productId.siid = null;
    this.productId.clid = this.selectedColor;
    this.fetchProductDetails();
    console.log(this.shoesDetails);
  }

  getFeedBack(shid: number, brid: number) {
    const params = new HttpParams()
      .set("shid", shid.toString())
      .set("brid", brid.toString());
    // Gửi yêu cầu GET
    this.http
      .get<any>("http://localhost:8088/api/shop/feed-back", { params })
      .subscribe(
        (response) => {
          this.feedbacks = response;
        },
        (error) => {
          // Xử lý lỗi ở đây
        }
      );
  }

  onSizeChange() {
    this.productId.siid = this.selectedsize;
    this.productId.clid = this.selectedColor;
    this.fetchProductDetails();
  }

  splitPaths(input: string): any[] {
    const pathsArray = input.split(",");
    const trimmedPaths = pathsArray.map((path) => path.trim());
    return trimmedPaths;
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
      if (sessionStorage.getItem("access_token") != null) {
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
                this.cartDetailService.getCount().subscribe((Response) => {
                  this.cartDetailCustomerService.setData(Response);
                });
                this.router.navigate(["/client/cart"]);
              });
          }
        });
      } else {
        this.cartDetailCustom = {
          id: this.shoesDetails.id,
          idsh: this.shoesDetails.shoes_id,
          idsz: this.shoesDetails.size_id,
          idc: this.shoesDetails.color_id,
          idb: this.shoesDetails.brand_id,
          path: this.shoesDetails.path,
          status: 1,
          quantity: this.quantity,
          quantityShoesDetail: this.shoesDetails.quantity,
          price: this.shoesDetails.price,
          shoesdetailid: this.shoesDetails.id,
          namesize: this.shoesDetails.size_name,
          namecolor: this.shoesDetails.color_name,
          nameshoes: this.shoesDetails.name,
          checkBox: false,
        };
        sessionStorage.setItem(
          "cartDetailCustom",
          JSON.stringify(this.cartDetailCustom)
        );
        this.router.navigate(["/client/cart"]);
      }
    }
  }

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
  ngOnInit() {
    this.feedbackForm = this.fb.group({
      comment: ["", Validators.required],
      rate: [0],
      // user and shoes will be set when submitting the form
      user: [null],
      shoes: [null],
      status: 1,
    });
  }

  submitFeedback() {
    // Set user and shoes details
    this.feedbackForm.patchValue({
      user: this.user,
      shoes: this.shoesDetails,
      status: 0,
    });
    if (this.feedbackForm.valid) {
      this.http
        .post("http://localhost:8088/api/feed-backs", this.feedbackForm.value)
        .subscribe({
          next: (response) => {
            console.log("Feedback submitted", response);
            this.feedbackForm.reset();
            this.messageService.add({
              severity: "success",
              summary: "Đã gửi feedback",
              detail: "Feedback của bạn đã được gửi và chờ phê duyệt",
            });
            this.getFeedBack(
              this.shoesDetails.shoes_id,
              this.shoesDetails.brand_id
            );
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: "error",
              summary: "Lỗi hệ thống",
              detail: error.error.title,
            });
          },
        });
    } else {
      // Hiển thị thông báo lỗi
      this.messageService.add({
        severity: "warn",
        summary: "Thiếu nội dung đánh giá",
        detail: "Vui lòng kiểm tra lại thông tin đánh giá",
      });
    }
  }
}
