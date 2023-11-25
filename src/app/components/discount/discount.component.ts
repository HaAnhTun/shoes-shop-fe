import { Component, OnInit } from "@angular/core";
import {
  ConfirmEventType,
  ConfirmationService,
  MessageService,
} from "primeng/api";
import { Table } from "primeng/table";
import { Discount } from "src/app/model/Discount";
import { ShoesCategory } from "src/app/model/ShoesCategory";
import { ShoesCategoryValue } from "src/app/model/ShoesCategoryValue";
import { DiscountService } from "src/app/service/discount.service";
import { ShoesCategoryService } from "src/app/service/shoes-category.service";

@Component({
  selector: "app-discount",
  templateUrl: "./discount.component.html",
  styleUrls: ["./discount.component.css"],
})
export class DiscountComponent implements OnInit {
  shoesCategoryDialog: boolean = false;
  shoesCategoryValueDialog: boolean = false;

  deleteShoesCategoryDialog: boolean = false;

  deleteShoesCategoriesDialog: boolean = false;
  updateShoesCategoryDialog: boolean = false;
  saveShoesCategoryDialog: boolean = false;
  shoesCategories: ShoesCategory[] = [];
  discounts: any[] = [];
  visible: boolean = true;
  shoesCategory: ShoesCategory = {};
  shoesCategoryValue: ShoesCategoryValue = {};
  selectedShoesCategories: ShoesCategory[] = [];
  searchText: string = "   ";
  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];
  first: number = 0;

  rows: number = 10;

  // onPageChange(event: PageEvent) {
  //   this.first = event.first;
  //   this.rows = event.rows;
  // }
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private discountService: DiscountService
  ) {}
  ngOnInit(): void {
    this.discountService.search(this.searchText).subscribe(
      (response) => {
        this.discounts = response;
      },
      (error) => {
        console.error("Error:", error);
      }
    );
  }
  updateVisibility(): void {
    this.visible = false;
    this.ngOnInit();
    setTimeout(() => (this.visible = true), 500);
  }
  updateTable(): void {
    this.visible = false;
    setTimeout(() => (this.visible = true), 0);
  }
  deleteDiscount(id: number) {
    this.confirmationService.confirm({
      message: "Bạn muốn xoá khuyến mãi này?",
      header: "Xác nhận",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.discountService.deleteDiscount(id).subscribe(
          (res) => {
            this.updateVisibility();
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: "Shoes Categories Deleted",
              life: 3000,
            });
          },
          (error) => {}
        );
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
  search() {
    this.discountService
      .search(this.searchText == "" ? "   " : this.searchText)
      .subscribe((res) => {
        this.discounts = res;
        console.log(res);
        this.updateTable();
      });
  }
  delay(time: any) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
