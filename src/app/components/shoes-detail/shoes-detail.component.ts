import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppConstants } from 'src/app/app-constants';

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
  @ViewChild(Table) dt: Table;
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
    this.http.get<any>(AppConstants.BASE_URL_API + "/api/shoes-details-variants").subscribe((response) => { this.products = response });
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
      message: 'Bạn có chắc xóa các sản phẩm được chọn?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedProducts?.every(e => { this.http.delete(AppConstants.BASE_URL_API + '/api/shoes-details/' + e.id) })
        this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
        this.selectedProducts = null;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Xóa các sản phẩm thành công', life: 3000 });
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
    this.productDialog = true;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn xóa ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.delete(AppConstants.BASE_URL_API + '/api/shoes-details/' + product.id).subscribe(response => {
          this.products.forEach(producty => {
            if (producty.id === product.id) {
              producty.status = 0;
              this.dt.filter(1, 'status', 'contains');

            }
          });
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
    if (this.productForm.valid) {
      this.confirmationService.confirm({
        message: 'Bạn có muốn update sản phẩm này ?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.submitted = true;
          this.product.id = this.productForm.get('id')?.value;
          this.product.code = this.productForm.get('code')?.value;
          this.product.price = this.productForm.get('price')?.value;
          this.product.import_price = this.productForm.get('import_price')?.value;
          this.product.tax = this.productForm.get('tax')?.value;
          this.product.quantity = this.productForm.get('quantity')?.value;
          this.product.description = this.productForm.get('description')?.value;
          this.product.status = this.productForm.get('status')?.value;
          this.product.brand = { id: this.product.brand_id }
          this.product.shoes = { id: this.product.shoes_id }
          this.product.color = { id: this.product.color_id }
          this.product.size = { id: this.product.size_id }
          console.log(this.product);
          this.http.put<any>(AppConstants.BASE_URL_API + '/api/shoes-details/' + this.product.id, this.product).subscribe(response => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã cập nhật', life: 3000 });
            this.products.forEach(producty => {
              if (producty.id === response.id) {
                const sts = producty.status;
                producty.tax = response.tax;
                producty.description = response.description;
                producty.quantity = response.quantity;
                producty.import_price = response.import_price;
                producty.price = response.price;
                producty.status = response.status;
                if (producty.status != sts)
                  this.dt.filter(1, 'status', 'contains');
              }
            })
          },
            error => {
              this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Lỗi cập nhật', life: 3000 });
            });
          console.log(this.product);
          this.productDialog = false;
          this.product = {};
        }
      });
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