import { Component, OnInit } from "@angular/core";
import {
  ConfirmEventType,
  ConfirmationService,
  MessageService,
} from "primeng/api";
import { Table } from "primeng/table";
import { Discount } from "src/app/model/DiscountShoesDetails";
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
  discounts: Discount[] = [];

  shoesCategory: ShoesCategory = {};
  shoesCategoryValue: ShoesCategoryValue = {};
  selectedShoesCategories: ShoesCategory[] = [];
  searchText: String = "";
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
    this.discountService.getDiscounts().subscribe(
      (response) => {
        this.discounts = response;
      },
      (error) => {
        console.error("Error:", error);
      }
    );
  }
}
