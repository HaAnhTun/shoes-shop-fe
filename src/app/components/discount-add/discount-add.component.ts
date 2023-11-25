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
  shoesDetails: any[];
  shoesDetails2: Product[];
  selectedShoes: any[] = new Array();
  discount: Discount;
  product: Product | null;
  enable: boolean = false;
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
    code: [{ value: "", disabled: true }],
    name: ["", Validators.required],
    discountMethod: ["", Validators.required],
    discountAmount: [0],
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
          this.selectedShoes.push(p);
          this.discountShoesDetails = p;
          this.pushShoes2();
        }
      });
    }
    this.updateVisibility();
    this.discountMethods = [
      { id: 1, name: "Giảm tiền cho tất cả giày" },
      { id: 2, name: "Giảm % cho tất cả giày" },
      { id: 3, name: "Giảm tiền cho từng giày" },
      { id: 4, name: "Giảm % cho từng giày" },
    ];
  }
  updateVisibility() {
    this.enable = false;
    setTimeout(() => (this.enable = true), 500);
  }
  openShoesDetailsDialog() {
    this.selectedShoes = [];
    this.shoesDetailsDialog = true;
  }
  hideShoesDetailsDialog() {
    this.shoesDetailsDialog = false;
  }
  get discountShoesDetailsDTOS() {
    return this.formDiscount.get("discountShoesDetailsDTOS") as FormArray;
  }
  get code() {
    return this.formDiscount.get("code") as FormControl;
  }
  isVisiable() {
    let check = false;
    if (
      this.formDiscount.get("discountMethod")?.value == "1" ||
      this.formDiscount.get("discountMethod")?.value == "2"
    ) {
      check = true;
    }
    if (check) {
      // Add the custom validator when the field is visible
      this.formDiscount
        .get("discountMethod")
        ?.setValidators([Validators.required]);
    } else {
      // Remove the custom validator when the field is not visible
      this.formDiscount.get("discountMethod")?.clearValidators();
    }

    // Update the validation status
    this.formDiscount.get("discountMethod")?.updateValueAndValidity();
    this.formDiscount.updateValueAndValidity();
  }

  initDetails(data: any) {
    return this.fb.group({
      id: [""],
      shoesDetails: [{ id: data.shoesDetails.shoes_id }],
      code: [data.shoesDetails.shoesCode],
      name: [data.shoesDetails.name],
      brandId: [data.shoesDetails.brand_id],
      brand: [data.shoesDetails.brandName],
      discountAmount: [data.discountAmount],
      status: [data.status ? data.status : 1],
    });
  }
  initDetails2(data: any) {
    return this.fb.group({
      id: [data ? data.id : ""],
      shoesDetails: [{ id: data.shoesDetails.id }],
      code: [data.shoesDetails.code],
      name: [data.shoesDetails.name],
      brandId: [data.brandId],
      brand: [data.brandName],
      discountAmount: [data.discountAmount],
      status: [data.status ? data.status : 1],
    });
  }
  pushShoes() {
    for (let p of this.selectedShoes) {
      console.log(p);
      this.discountShoesDetails.shoesDetails = p;
      if (
        this.discountShoesDetailsDTOS.value.find(
          (value: { brandId: number; shoesDetails: any; "": any }) => {
            if (
              value.shoesDetails.id == p.shoes_id &&
              value.brandId == p.brand_id
            ) {
              return p;
            }
            return null;
          }
        )
      ) {
        break;
      }
      this.discountShoesDetailsDTOS.push(
        this.initDetails(this.discountShoesDetails)
      );
    }

    this.hideShoesDetailsDialog();
  }
  pushShoes2() {
    this.discountShoesDetailsDTOS.push(
      this.initDetails2(this.discountShoesDetails)
    );
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
              this.router.navigate(["/admin/discount"]).then(() => {
                this.messageService.add({
                  severity: "success",
                  summary: "Success",
                  detail: "Lưu thông tin thành công!",
                });
              });
            },
            (error) => {
              console.log(error);
              this.messageService.add({
                severity: "error",
                summary: "Lỗi",
                detail: error.error.fieldErrors
                  ? error.error.fieldErrors[0].message
                  : error.error.title,
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
        if (
          this.discountShoesDetailsDTOS.at(index).get("id")?.value &&
          this.discountShoesDetailsDTOS.at(index).get("id")?.value != ""
        ) {
          this.discountShoesDetailsDTOS.at(index).get("status")?.setValue(-1);
        } else {
          this.discountShoesDetailsDTOS.removeAt(index);
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
}
