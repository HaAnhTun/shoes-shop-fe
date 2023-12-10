import { HttpClient } from "@angular/common/http";
import { Component, NgModule, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  MessageService,
  ConfirmationService,
  ConfirmEventType,
} from "primeng/api";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";

@Component({
  selector: "app-return-order",
  templateUrl: "./return-order.component.html",
  styleUrls: ["./return-order.component.css"],
})
export class ReturnOrderComponent implements OnInit {
  order: any;
  orderId: any = -1;
  enable: boolean[] = [];
  selectedOrderDetails: any[] = [];
  returnMethods: any[];
  shoesDetails: any[];
  selectedCountry: any;
  filteredCountries: any[] | undefined;
  disabledRows: Set<number> = new Set<number>();
  isDisable: boolean[] = [];
  quantityEnable: boolean[] = [];
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get("id"));
    this.http
      .get("http://localhost:8088/api/orders/" + this.orderId)
      .subscribe((res) => {
        this.order = res;
        console.log(this.order);
        for (let data of this.order.orderDetailsDTOList) {
          let orderdetail = this.initReturnOrderDetails(data);
          // let returnShoesDetails = orderdetail.get(
          //   "returnShoesDetails"
          // ) as FormArray;
          // returnShoesDetails.push(this.initReturnShoesDetails());
          this.returnOrderDetails.push(orderdetail);
          this.enable.push(false);
          this.isDisable.push(true);
        }
      });
    this.fetchProducts();
    this.datas = this.fb.group({
      orderId: [this.orderId],
      returnOrderDetails: this.fb.array<FormArray>([]),
    });
    this.returnMethods = [
      {
        code: 1,
        name: "Đổi hàng",
      },
      {
        code: 2,
        name: "Trả hàng",
      },
    ];
  }
  enableRow(index: number) {
    if (this.isDisable[index]) {
      this.isDisable[index] = false;
    } else {
      this.isDisable[index] = true;
    }
  }
  onQuantityChange(quantity: number, i: number, index: number) {
    if (quantity >= i) {
      this.showMessage();
    }
  }
  enableQuantity(event: Event, index: number, i: number) {
    console.log(index);
    if (
      this.shoesReturnDetails(index).at(i).get("shoesDetailsId") &&
      this.shoesReturnDetails(index).at(i).get("shoesDetailsId")?.value.id
    ) {
      this.shoesReturnDetails(index).at(i).get("quantity")?.enable();
    }
  }
  showMessage() {
    this.messageService.add({
      severity: "warn",
      summary: "Số Lượng tối đa",
      detail: "Đã đạt giới hạn hàng trong kho",
    });
  }
  datas: FormGroup;
  get returnOrderDetails() {
    return this.datas.get("returnOrderDetails") as FormArray;
  }
  shoesReturnDetails(index: number) {
    return (this.returnOrderDetails.at(index) as FormGroup).get(
      "returnShoesDetails"
    ) as FormArray;
  }
  get orderDetails() {
    return this.order.orderDetailsDTOList as any[];
  }
  pushOrderDetails(data: { id: any }) {
    this.returnOrderDetails.push(this.initReturnOrderDetails(data));
  }
  initReturnOrderDetails(data: { id: any }) {
    return this.fb.group({
      orderDetailsId: [data.id],
      returnQuantity: ["", Validators.required],
      reason: ["", Validators.required],
      type: ["", Validators.required],
      returnShoesDetails: this.fb.array<FormArray>([]),
    });
  }
  initReturnShoesDetails() {
    return this.fb.group({
      shoesDetailsId: [""],
      quantity: [{ value: "", disabled: true }],
      price: [""],
      discount: [""],
    });
  }
  isRowDisabled(rowIndex: number): boolean {
    return this.disabledRows.has(rowIndex);
  }

  onCheckboxChange(rowData: any, rowIndex: number): void {
    if (rowData.isChecked) {
      this.disabledRows.add(rowIndex);
    } else {
      this.disabledRows.delete(rowIndex);
    }
  }
  filterCountry(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.shoesDetails as any[]).length; i++) {
      let country = (this.shoesDetails as any[])[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    this.filteredCountries = filtered;
  }
  fetchProducts() {
    this.http
      .post<any>("http://localhost:8088/api/shoes-details/shop", {
        sizeIds: [],
        brandId: null,
        startPrice: 1,
        endPrice: 10000000,
      })
      .subscribe(
        (data) => {
          this.shoesDetails = data;
          console.log(data);
        },
        (error) => {
          console.error("Error fetching products:", error);
        }
      );
  }
  addShoesDetails(index: number) {
    console.log(index);
    this.shoesReturnDetails(index).push(this.initReturnShoesDetails());
    this.quantityEnable.push(true);
  }
  deleteShoesDetails(index1: number, index2: number) {
    if (this.shoesReturnDetails(index1).controls.length > 1) {
      this.shoesReturnDetails(index1).removeAt(index2);
      this.quantityEnable.splice(index2, 1);
    }
  }
  selectedMethod(data: number, index: number) {
    if (data == 1) {
      this.enable[index] = true;
      (
        (this.returnOrderDetails.at(index) as FormGroup).get(
          "returnShoesDetails"
        ) as FormArray
      ).push(this.initReturnShoesDetails());
    } else {
      this.enable[index] = false;
      (
        (this.returnOrderDetails.at(index) as FormGroup).get(
          "returnShoesDetails"
        ) as FormArray
      ).clear();
      this.quantityEnable = [];
    }
  }
  submitOrder() {
    this.confirmationService.confirm({
      message: "Gửi yêu cầu đổi trả?",
      header: "Xác nhận",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        let isValid = true;
        if (this.selectedOrderDetails.length > 0) {
          this.returnOrderDetails.controls =
            this.returnOrderDetails.controls.filter((data1) => {
              return this.selectedOrderDetails.find((data) => {
                return (
                  data1.get("orderDetailsId")?.value ==
                  data.get("orderDetailsId")?.value
                );
              });
            });
          this.returnOrderDetails.controls.forEach((element) => {
            if (
              !element.get("returnQuantity")?.value ||
              element.get("returnQuantity")?.value <= 0
            ) {
              this.messageService.add({
                severity: "warn",
                summary: "Lỗi",
                detail: "Vui lòng nhập số lượng trả hàng!",
              });
              isValid = false;
            }
            if (!element.get("type")?.value) {
              this.messageService.add({
                severity: "warn",
                summary: "Lỗi",
                detail: "Vui lòng chọn phương thức đổi trả!",
              });
              isValid = false;
            }
            if (
              !element.get("reason")?.value ||
              !element.get("reason")?.value.trim()
            ) {
              this.messageService.add({
                severity: "warn",
                summary: "Lỗi",
                detail: "Vui lòng nhập lý do",
              });
              isValid = false;
            }
            if (element.get("type")?.value == 1) {
              if (
                element.get("returnShoesDetails") != null &&
                (element.get("returnShoesDetails") as FormArray).controls
                  .length > 0
              ) {
                (
                  element.get("returnShoesDetails") as FormArray
                ).controls.forEach((elemen1) => {
                  if (
                    !(elemen1.get("shoesDetailsId")?.value instanceof Number) &&
                    elemen1.get("shoesDetailsId")?.value
                  ) {
                    if (!elemen1.get("quantity")?.value) {
                      this.messageService.add({
                        severity: "warn",
                        summary: "Lỗi",
                        detail: "Vui lòng nhập sản phẩm muốn đổi!",
                      });
                      isValid = false;
                    }
                    let object = elemen1.get("shoesDetailsId")?.value;
                    elemen1.get("shoesDetailsId")?.setValue(object.id);
                    elemen1.get("price")?.setValue(object.price);
                    elemen1.get("discount")?.setValue(object.discount_amount);
                  } else {
                    this.messageService.add({
                      severity: "warn",
                      summary: "Lỗi",
                      detail: "Vui lòng chọn sản phẩm muốn đổi!",
                    });
                    isValid = false;
                  }
                });
              }
            }
          });
          if (isValid) {
            this.http
              .post("http://localhost:8088/api/order-returns", this.datas.value)
              .subscribe(
                (res) => {
                  this.messageService.add({
                    severity: "success",
                    summary: "Thành công",
                    detail: "Yêu cầu đổi trả thành công!",
                  });
                  setTimeout(() => {
                    this.router.navigate(["/client"]);
                  }, 1000);

                  console.log(res);
                },
                (error) => {
                  this.messageService.add({
                    severity: "error",
                    summary: "Lỗi",
                    detail: error.error.title,
                  });
                }
              );
          }
        } else {
          this.messageService.add({
            severity: "warn",
            summary: "Lỗi",
            detail: "Vui lòng chọn sản phẩm muốn yêu cầu!",
          });
        }
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: "error",
              summary: "Từ chối",
              detail: "Bạn vừa từ chối",
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
