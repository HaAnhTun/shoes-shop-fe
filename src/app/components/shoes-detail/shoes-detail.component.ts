import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppConstants } from 'src/app/app-constants';
import { Product } from 'src/app/model/Product';
import { ProductService } from 'src/app/product.service';
interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-shoes-detail',
  templateUrl: './shoes-detail.component.html',
  styleUrls: ['./shoes-detail.component.css']
})
export class ShoesDetailComponent {
  expandedRows: expandedRows = {};

  productDialog: boolean = false;

  products: any[];

  product!: any;

  selectedProducts!: any[] | null;

  submitted: boolean = false;

  statuses!: any[];

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService, private http: HttpClient, private route: Router) { }

  ngOnInit() {
    this.http.get<any>(AppConstants.BASE_URL_API + "/api/shoes-details").subscribe((response) => { this.products = response });
    this.statuses = [
      { label: 'INSTOCK', value: 1 },
      { label: 'LOWSTOCK', value: 2 },
      { label: 'OUTOFSTOCK', value: 3 },
      { label: 'Unknown', value: "" }
    ];
  }

  openNew() {
    this.route.navigate(["admin/shoes-detail-add"])
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
        this.selectedProducts = null;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      }
    });
  }


  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.delete(AppConstants.BASE_URL_API + '/api/shoes-details/' + product.id).subscribe(response => {
          console.log(response); this.products = this.products.filter((val) => val.id !== product.id);
          this.product = {};
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Product Delete Error', life: 3000 });
        })

      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.name?.trim()) {
      if (this.product.id) {
        this.product.createdBy = null
        this.product.createdDate = null
        this.product.lastModifiedBy = null
        this.product.lastModifiedDate = null
        this.http.put<any>(AppConstants.BASE_URL_API + '/api/shoes-details/' + this.product.id, this.product).subscribe(response => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        },
          error => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Product Create Error', life: 3000 });
          });
        this.products[this.findIndexById(this.product.id)] = this.product;
      } else {
        this.product.code = this.createCode();
        this.http.post<any>(AppConstants.BASE_URL_API + '/api/shoes-details/', this.product).subscribe(response => {
          this.products.push(this.product);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        },
          error => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Product Create Error', life: 3000 });
          });

      }

      this.products = [...this.products];
      this.productDialog = false;
      this.product = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createCode(): string {
    var code = 'SH';
    let number = this.products.length.toString()

    for (var i = 2; i < 8 - number.length; i++) {
      code += '0'
    }
    code += number
    return code;
  }

  getSeverity(status: number) {
    switch (status) {
      case 1:
        return 'success';
      case 2:
        return 'warning';
      case 3:
        return 'danger';
    }
    return 'warning';
  }
  getStatus(status: number) {
    switch (status) {
      case 1:
        return 'INSTOCK';
      case 2:
        return 'LOWSTOCK';
      case 3:
        return 'OUTOFSTOCK';
    }
    return 'New';
  }

}