import { Component, OnInit } from "@angular/core";
import { ShoesCategory } from "src/app/model/ShoesCategory";
import { ShoesCategoryValue } from "src/app/model/ShoesCategoryValue";
import { ShoesCategoryService } from "../../service/shoes-category.service";
import { MessageService } from "primeng/api";
import { Table } from "primeng/table";
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: "app-shoes-category",
  templateUrl: "./shoes-category.component.html",
  styleUrls: ["./shoes-category.component.css"],
  providers: [MessageService],
})
export class ShoesCategoryComponent implements OnInit {
  shoesCategoryDialog: boolean = false;
  shoesCategoryValueDialog: boolean = false;

  deleteShoesCategoryDialog: boolean = false;

  deleteShoesCategoriesDialog: boolean = false;

  shoesCategories: ShoesCategory[] = [];
  shoesCategoryValues: ShoesCategoryValue[] = [];

  shoesCategory: ShoesCategory = {};
  shoesCategoryValue: ShoesCategoryValue = {};
  selectedShoesCategories: ShoesCategory[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];
  first: number = 0;

  rows: number = 10;

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.rows = event.rows;
  }
  constructor(
    private shoesCategoryService: ShoesCategoryService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.shoesCategoryService.getShoesCategories().subscribe(
      (response) => {
        this.shoesCategories = response.content;
      },
      (error) => {
        console.error("Error:", error);
      }
    );
  }
  addShoesCategoryValue(categoryValue: ShoesCategoryValue) {
    this.shoesCategoryValues.push(categoryValue);
    this.cloesShoesCategoryValue();
  }
  cloesShoesCategoryValue() {
    this.shoesCategoryValueDialog = false;
  }
  update(idCategory: Number) {
    this.openNew();
    this.shoesCategoryService.getShoesCategoryValue(idCategory).subscribe(
      (response) => {
        this.shoesCategoryValues = response;
        console.log(this.shoesCategoryValues);
      },
      (error) => {
        console.error("Error:", error);
      }
    );
  }
  visible: boolean = true;
  updateVisibility(): void {
    this.visible = false;
    this.ngOnInit();
    setTimeout(() => (this.visible = true), 0);
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, "contains");
  }
  deleteSelectedShoesCateories() {
    this.deleteShoesCategoriesDialog = true;
  }

  editShoesCategory(shoesCategory: ShoesCategory) {
    this.shoesCategory = { ...shoesCategory };
    this.shoesCategoryDialog = true;
  }

  deleteShoesCategory(shoesCategory: ShoesCategory) {
    this.deleteShoesCategoryDialog = true;
    this.shoesCategory = { ...shoesCategory };
  }
  confirmDeleteSelected() {
    this.deleteShoesCategoryDialog = false;
    this.shoesCategories = this.shoesCategories.filter(
      (val) => !this.shoesCategories.includes(val)
    );
    this.messageService.add({
      severity: "success",
      summary: "Successful",
      detail: "Shoes Categories Deleted",
      life: 3000,
    });
    this.selectedShoesCategories = [];
  }
  openNew() {
    this.shoesCategory = {};
    this.shoesCategoryValues = [];
    this.submitted = false;
    this.shoesCategoryDialog = true;
  }
  openNewCategoryValue() {
    this.shoesCategoryValue = {};
    this.submitted = false;
    this.shoesCategoryValueDialog = true;
  }
  deleteSelectedShoesCategories() {
    this.deleteShoesCategoryDialog = true;
  }
  hideDialog() {
    this.shoesCategoryDialog = false;
    this.submitted = false;
  }
  saveShoesCategory() {
    this.submitted = true;
    if (this.shoesCategory.name?.trim()) {
      if (this.shoesCategory.id) {
        // @ts-ignore
      } else {
        this.shoesCategory.shoesCategoryValueDTOList = this.shoesCategoryValues;
        this.shoesCategoryService.save(this.shoesCategory).subscribe(
          (response) => {
            this.shoesCategory = response;
            console.log(response);
            this.updateVisibility();
          },
          (error) => {
            console.error("Error:", error);
          }
        );
        this.hideDialog();
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "shoesCategory Created",
          life: 3000,
        });
      }
    }
  }
  confirmDelete() {
    this.deleteShoesCategoryDialog = false;
    this.shoesCategories = this.shoesCategories.filter(
      (val) => val.id !== this.shoesCategory.id
    );
    this.messageService.add({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000,
    });
    this.shoesCategory = {};
  }
}
