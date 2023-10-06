import { Component, OnInit } from "@angular/core";
import { ShoesCategory } from "src/app/model/ShoesCategory";
import { ShoesCategoryService } from "../../service/shoes-category.service";
import { MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { PaginatorModule } from "primeng/paginator";
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

  deleteShoesCategoryDialog: boolean = false;

  deleteShoesCategoriesDialog: boolean = false;

  shoesCategories: ShoesCategory[] = [];

  shoesCategory: ShoesCategory = {};

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
    this.submitted = false;
    this.shoesCategoryDialog = true;
  }
  deleteSelectedShoesCategories() {
    this.deleteShoesCategoryDialog = true;
  }
  hideDialog() {
    this.shoesCategoryDialog = false;
    this.submitted = false;
  }
  saveShoesCategory() {
    // this.submitted = true;
    // if (this.shoesCategory.name?.trim()) {
    //     if (this.shoesCategory.id) {
    //         // @ts-ignore
    //         this.shoesCategory.inventoryStatus = this.shoesCategory.inventoryStatus.value ? this.shoesCategory.inventoryStatus.value : this.shoesCategory.inventoryStatus;
    //         this.shoesCategories[this.findIndexById(this.shoesCategory.id)] = this.shoesCategory;
    //         this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'shoesCategory Updated', life: 3000 });
    //     } else {
    //         this.shoesCategory.id = this.createId();
    //         this.shoesCategory.code = this.createId();
    //         this.shoesCategory.image = 'shoesCategory-placeholder.svg';
    //         // @ts-ignore
    //         this.shoesCategory.inventoryStatus = this.shoesCategory.inventoryStatus ? this.shoesCategory.inventoryStatus.value : 'INSTOCK';
    //         this.shoesCategories.push(this.shoesCategory);
    //         this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'shoesCategory Created', life: 3000 });
    //     }
    //     this.shoesCategories = [...this.shoesCategories];
    //     this.shoesCategoryDialog = false;
    //     this.shoesCategory = {};
    // }
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
