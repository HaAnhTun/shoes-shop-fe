import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppConstants } from 'src/app/app-constants';
import { ProductService } from 'src/app/product.service';
interface expandedRows {
  [key: string]: boolean;
}
interface Product {
  id: number;
  code: string;
  price: number;
  import_price: number;
  tax: number;
  quantity: number;
  description: string;
  status: number;
  shoes: {
    id: number;
    name: string;
  };
  brand: {
    id: number;
    name: string;
  };
  size: {
    id: number;
    name: string;
  };
  color: {
    id: number;
    name: string;
  };
}



interface UploadEvent {
  originalEvent: Event;
  files: File[];
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

  productForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private messageService: MessageService, private confirmationService: ConfirmationService, private http: HttpClient, private route: Router) {
    this.productForm = this.formBuilder.group({
      id: [null, Validators.required],
      code: [null, Validators.required],
      price: [null, Validators.required],
      import_price: [null, Validators.required],
      tax: [null, Validators.required],
      quantity: [null, Validators.required],
      description: [null, Validators.required],
      status: [],
    });
  }

  ngOnInit() {
    this.http.get<any>(AppConstants.BASE_URL_API + "/api/shoes-details").subscribe((response) => { this.products = response });
    this.statuses = [
      { label: 'Khả dụng', value: 1 },
      { label: 'Không khả dụng', value: 0 },
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

  ouput() {
    console.log(this.productForm.value);

  }

  editProduct(productData: Product) {
    this.product = { ...productData };
    this.productForm.setValue({
      id: productData.id,
      code: productData.code,
      price: productData.price,
      import_price: productData.import_price,
      tax: productData.tax,
      quantity: productData.quantity,
      description: productData.description,
      status: productData.status,
    });
    console.log(productData);
    this.productDialog = true;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn xóa ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.delete(AppConstants.BASE_URL_API + '/api/shoes-details/' + product.id).subscribe(response => {
          this.products = this.products.filter((val) => val.id !== product.id);
          this.product = {};
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Xóa sản phẩm thành công', life: 3000 });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Xóa thất bại', life: 3000 });
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
    switch (true) {
      case status < 0:
        return 'danger';
      case status < 10:
        return 'warning';
      case status > 10:
        return 'success';
    }
    return 'warning';
  }
  getStatus(status: number) {
    switch (true) {
      case status <= 0:
        return 'Hết hàng';
      case status < 10:
        return 'Còn ít';
      case status > 10:
        return 'Còn hàng';
    }
    return 'LOWSTOCK';
  }

  getSeverityProduct(status: number) {
    switch (status) {
      case 0:
        return 'danger';
      case 1:
        return 'success';
    }
    return 'danger';
  }

  /**
* Kiểm tra xem FormControl đã bị lỗi và đã được tương tác (click) hay chưa.
* @param controlName Tên của FormControl cần kiểm tra
* @returns True nếu FormControl có lỗi và đã được tương tác, ngược lại trả về false hoặc undefined
*/
  isFormControlInvalidAndTouched(controlName: string): boolean | undefined {
    // Lấy FormControl từ FormGroup bằng cách sử dụng tên của FormControl
    const control = this.productForm.get(controlName);
    // Kiểm tra xem FormControl có tồn tại, có lỗi và đã được tương tác hay không
    return control?.invalid && (control?.touched || control?.dirty);
  }

  /**
   * Đánh dấu tất cả các FormControl trong FormGroup và các nhóm FormGroup con như đã tương tác (touched).
   * @param formGroup Đối tượng FormGroup cần đánh dấu các FormControl đã tương tác
   */
  markAllFormControlsAsTouched(formGroup: any) {
    // Duyệt qua tất cả các tên của các FormControl trong FormGroup
    Object.keys(formGroup.controls).forEach((controlName) => {
      // Lấy ra FormControl tương ứng từ FormGroup
      const control = formGroup.get(controlName);
      control.markAsTouched({ onlySelf: true });

    });
  }


}