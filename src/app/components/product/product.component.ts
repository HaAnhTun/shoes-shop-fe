import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppConstants } from 'src/app/app-constants';
import { Product } from 'src/app/model/Product';
import { ProductService } from 'src/app/product.service';
interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  expandedRows: expandedRows = {};

  productDialog: boolean = false;

  products: any[];

  product!: any;

  selectedProducts!: Product[] | null;

  submitted: boolean = false;

  statuses!: any[];

  constructor(private productService: ProductService, private messageService: MessageService, private confirmationService: ConfirmationService, private http: HttpClient) { }

  ngOnInit() {
    this.productService.getProducts().subscribe(data => this.products = data);
    console.log(this.products);
    this.statuses = [
      { label: 'INSTOCK', value: 1 },
      { label: 'LOWSTOCK', value: 2 },
      { label: 'OUTOFSTOCK', value: 3 },
      { label: 'NEW', value: "" }
    ];
  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
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

        this.http.delete(AppConstants.BASE_URL_API + '/api/shoes/' + product.id).subscribe(response => {
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
        this.http.put<any>(AppConstants.BASE_URL_API + '/api/shoes/' + this.product.id, this.product).subscribe(response => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        },
          error => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Product Create Error', life: 3000 });
          });
        this.products[this.findIndexById(this.product.id)] = this.product;
      } else {
        this.product.code = this.createCode();
        this.http.post<any>(AppConstants.BASE_URL_API + '/api/shoes/', this.product).subscribe(response => {
          this.products.push(response);
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