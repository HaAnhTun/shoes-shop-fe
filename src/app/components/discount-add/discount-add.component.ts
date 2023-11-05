import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import {
  ConfirmEventType,
  ConfirmationService,
  MessageService,
} from "primeng/api";
import { Discount } from "src/app/model/Discount";
import { DiscountShoesDetails } from "src/app/model/DiscountShoesDetails";
import { Product } from "src/app/model/Product";
import { ProductService } from "src/app/product.service";
import { DiscountService } from "src/app/service/discount.service";

@Component({
  selector: "app-discount-add",
  templateUrl: "./discount-add.component.html",
  styleUrls: ["./discount-add.component.css"],
})
export class DiscountAddComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private discountService: DiscountService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}
  idDiscount: number | null;
  shoesDetailsDialog: boolean = false;
  shoesDetails: Product[];
  shoesDetails2: Product[];
  selectedShoes: Product[] = new Array();
  discount: Discount;
  product: Product | null;
  discountShoesDetails: DiscountShoesDetails = {
    shoesDetails: {
      id: 0,
      name: "",
      code: "",
      description: "",
      price: 0,
      categories: [],
      brand: "",
      rating: 0,
      image: "",
      inStock: true,
    },
  };
  discountMethods: Object[];
  formDiscount = this.fb.group({
    id: [""],
    code: ["", Validators.required],
    name: ["", Validators.required],
    discountMethod: ["", Validators.required],
    discountAmount: ["", Validators.required],
    discountStatus: [""],
    startDate: ["", Validators.required],
    endDate: ["", Validators.required],
    discountShoesDetailsDTOS: this.fb.array([]),
  });
  ngOnInit(): void {
    this.productService.getProducts().subscribe((response) => {
      this.shoesDetails = response;
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.idDiscount = Number(params.get("id"));
    });
    if (this.idDiscount != null && this.idDiscount != 0) {
      this.discountService.getDiscount(this.idDiscount).subscribe((res) => {
        this.formDiscount.get("id")?.setValue(res.id);
        this.formDiscount.get("code")?.setValue(res.code);
        this.formDiscount.get("name")?.setValue(res.name);
        this.formDiscount.get("discountMethod")?.setValue(res.discountMethod);
        this.formDiscount.get("discountAmount")?.setValue(res.discountAmount);
        this.formDiscount.get("discountStatus")?.setValue(res.discountStatus);
        this.formDiscount
          .get("startDate")
          ?.setValue(new Date(res.startDate).toISOString().split("T")[0]);
        this.formDiscount
          .get("endDate")
          ?.setValue(new Date(res.endDate).toISOString().split("T")[0]);
        for (let p of res.discountShoesDetailsDTOS) {
          this.selectedShoes.push(p.shoesDetails);
          this.discountShoesDetails = p;
          this.pushShoes2();
        }
      });
    }
    this.discountMethods = [
      { id: 1, name: "Giảm tiền cho tất cả giày" },
      { id: 2, name: "Giảm % cho tất cả giày" },
      { id: 3, name: "Giảm tiền cho từng giày" },
      { id: 4, name: "Giảm % cho từng giày" },
    ];
  }
  openShoesDetailsDialog() {
    this.shoesDetailsDialog = true;
  }
  hideShoesDetailsDialog() {
    this.shoesDetailsDialog = false;
  }
  get discountShoesDetailsDTOS() {
    return this.formDiscount.get("discountShoesDetailsDTOS") as FormArray;
  }
  get code() {
    return this.formDiscount.get("code");
  }
  initDetails(data: DiscountShoesDetails) {
    return this.fb.group({
      id: [data ? data.id : ""],
      shoesDetails: [{ id: data.shoesDetails.id }],
      code: [data.shoesDetails.code],
      name: [data.shoesDetails.name],
      brand: [data.shoesDetails.brand],
      discountAmount: [data.discountAmount],
      status: [data.status ? data.status : 1],
    });
  }
  pushShoes() {
    for (let p of this.selectedShoes) {
      this.discountShoesDetails.shoesDetails = p;
      console.log(this.discountShoesDetails);
      this.discountShoesDetailsDTOS.push(
        this.initDetails(this.discountShoesDetails)
      );
    }
    this.shoesDetails = this.shoesDetails.filter(
      (shoes) => !this.selectedShoes.includes(shoes)
    );
    this.hideShoesDetailsDialog();
  }
  pushShoes2() {
    this.discountShoesDetailsDTOS.push(
      this.initDetails(this.discountShoesDetails)
    );
    this.shoesDetails = this.shoesDetails.filter(
      (shoes) => !this.selectedShoes.includes(shoes)
    );
    console.log(this.formDiscount.value);
  }
  isFormControlInvalidAndTouched(controlName: string): boolean | undefined {
    // Lấy FormControl từ FormGroup bằng cách sử dụng tên của FormControl
    const control = this.formDiscount.get(controlName);
    // Kiểm tra xem FormControl có tồn tại, có lỗi và đã được tương tác hay không
    return control?.invalid && (control?.touched || control?.dirty);
  }

  deleteShoes(index: number) {
    this.discountShoesDetailsDTOS.removeAt(index);
  }
  saveFormDiscount() {
    this.confirmationService.confirm({
      message: "Chắc chắn muốn lưu thông tin khuyến mãi?",
      header: "Xác nhận",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.formDiscount.markAllAsTouched();
        if (!this.formDiscount.invalid) {
          this.discountService.saveDiscount(this.formDiscount.value).subscribe(
            (res) => {
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: "Thêm mới thành công!",
              });
              this.router.navigate(["/admin/discount"]);
            },
            (error) => {
              console.log(error);
              this.messageService.add({
                severity: "error",
                summary: "Rejected",
                detail: error.error.fieldErrors[0].message,
              });
            }
          );
        }
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: "error",
              summary: "Rejected",
              detail: "You have rejected",
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: "warn",
              summary: "Cancelled",
              detail: "You have cancelled",
            });
            break;
        }
      },
    });
  }
  deleteShoesDetails(index: number) {
    this.confirmationService.confirm({
      message: "Chắc chắn xóa giày này?",
      header: "Xóa giày",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.discountShoesDetailsDTOS.at(index).get("status")?.setValue(-1);
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: "error",
              summary: "Rejected",
              detail: "You have rejected",
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: "warn",
              summary: "Cancelled",
              detail: "You have cancelled",
            });
            break;
        }
      },
    });
  }
}