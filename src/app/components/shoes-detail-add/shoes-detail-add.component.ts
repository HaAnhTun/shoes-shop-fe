import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { log, warn } from 'console';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppConstants } from 'src/app/app-constants';
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

interface expandedRows {
  [key: string]: boolean;
}
interface ShoesDetail {
  code: string;
  price: number;
  import_price: number;
  tax: number;
  quantity: number;
  status: number;
  images: File[];
  description: string;
  shoes: {
    id: number;
    name: string;
  };
  brand: {
    id: number;
    name: string;
  };
  color: {
    id: number;
    name: string;
  };
  size: {
    id: number;
    name: string;
  };

}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-shoes-detail-add',
  templateUrl: './shoes-detail-add.component.html',
  styleUrls: ['./shoes-detail-add.component.css'],

})
export class ShoesDetailAddComponent implements OnInit {
  countries: any[] | undefined;
  shoeVariants: ShoesDetail[];
  shoesVariantsList: any[];
  selectedCountry: any;


  expandedRows: expandedRows = {};

  productDialog: boolean = false;

  shoes: any[];  //products mean shoes 

  brands: any[];

  sizes: any[];

  colors: any[];

  selectedColors: any[];
  selectedSizes: any[];

  filteredShoes: any[];
  filteredBrands: any[];
  filteredSizes: any[];
  filteredColors: any[];

  product: any;

  selectedProducts!: any[] | null;

  submitted: boolean = false;

  statuses!: any[];

  formGroup: FormGroup;

  checked: boolean = false;

  shoes_detail: ShoesDetail
  displayTable: boolean = false;

  uploadedFiles: any[] = [];


  onUpload(event: UploadEvent) {
    for (let file of event.files) {
      const objectTest = new FormData();
      objectTest.append('file', file);
      const httpOptions = {
        headers: new HttpHeaders()
      };
      this.http.post<any>("http://localhost:8088/api/shoes-categories/upload", objectTest, httpOptions).subscribe(response => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.name, life: 3000 });
      },
        error => {
          this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error, life: 3000 });
        });
    }
    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }


  selection(event: UploadEvent) {
    console.log('aa');
    for (let i = 0; i < event.files.length; i++) {
      this.uploadedFiles.push(event.files[i]);
      console.log('Selected File at Index ' + i + ':', event.files[i]);
    }
  }

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService, private http: HttpClient, private route: Router, private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      shoes: [null, Validators.required],
      checked: [false, Validators.required],
      brand: [null, Validators.required],
      description: [null, Validators.required],
      import_price: [null, [Validators.required, Validators.min(0), Validators.max(999999999)]],
      quantity: [null, [Validators.required, Validators.min(0), Validators.max(999999999)]],
      price: [null, [Validators.required, Validators.min(0), Validators.max(999999999)]],
      tax: [null, [Validators.required, Validators.min(0), Validators.max(999999999)]],
      color: [null, Validators.required],
      size: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.fetchData();
    this.statuses = [
      { label: 'INSTOCK', value: 1 },
      { label: 'LOWSTOCK', value: 2 },
      { label: 'OUTOFSTOCK', value: 3 },
      { label: 'not available', value: 0 }
    ];
  }

  saveVariants() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to create ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        const httpOptions = {
          headers: new HttpHeaders({})
        };
        this.shoeVariants.forEach(variant => {
          let isCodeFound = this.shoesVariantsList.some(v => v.code == variant.code);
          if (isCodeFound) {
            this.messageService.add({ severity: 'warning', summary: 'Exist', detail: 'Variants ' + variant.shoes.name + '-' + variant.brand.name + '[' + variant.color.name + '-' + variant.size.name + ']' + ' Existed', life: 3000 });
          } else {
            this.http.post<any>(AppConstants.BASE_URL_API + '/api/shoes-details/', variant, httpOptions).subscribe(response => {
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Variants [' + variant.code + '] Created', life: 3000 });
            },
              error => {
                this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Variants [' + variant.code + ']  Create Error', life: 3000 });
              });
          }
        })
        this.shoeVariants = [];
        this.http.get<any>(AppConstants.BASE_URL_API + "/api/shoes-details").subscribe((response) => { this.shoesVariantsList = response });
      }
    });
  }

  fetchData() {
    this.http.get<any>(AppConstants.BASE_URL_API + "/api/shoes").subscribe((response) => { this.shoes = response });
    this.http.get<any>(AppConstants.BASE_URL_API + "/api/brands").subscribe((response) => { this.brands = response });
    this.http.get<any>(AppConstants.BASE_URL_API + "/api/sizes").subscribe((response) => { this.sizes = response });
    this.http.get<any>(AppConstants.BASE_URL_API + "/api/colors").subscribe((response) => { this.colors = response });
    this.http.get<any>(AppConstants.BASE_URL_API + "/api/shoes-details").subscribe((response) => { this.shoesVariantsList = response });
  }

  /**
  * Kiểm tra xem FormControl đã bị lỗi và đã được tương tác (click) hay chưa.
  * @param controlName Tên của FormControl cần kiểm tra
  * @returns True nếu FormControl có lỗi và đã được tương tác, ngược lại trả về false hoặc undefined
  */
  isFormControlInvalidAndTouched(controlName: string): boolean | undefined {
    // Lấy FormControl từ FormGroup bằng cách sử dụng tên của FormControl
    const control = this.formGroup.get(controlName);
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


  filterList(event: AutoCompleteCompleteEvent, list: any[], filteredList: string) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < list.length; i++) {
      let products = list[i];
      if (products.name.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(products);
      }
    }
    switch (filteredList) {
      case 'shoes': {
        this.filteredShoes = filtered;
        break;
      }
      case 'brands': {
        this.filteredBrands = filtered;
        break;
      }
      case 'sizes': {
        this.filteredSizes = filtered;
        break;
      }
      case 'colors': {
        this.filteredColors = filtered;
        break;
      }
      default: {
        break;
      }
    }
  }

  generateShoeVariants(selectedColors: any[], selectedSizes: any[]): ShoesDetail[] {
    this.http.get<any>(AppConstants.BASE_URL_API + "/api/shoes-details").subscribe((response) => { this.shoesVariantsList = response });
    const variants: ShoesDetail[] = [];
    for (const color of selectedColors) {
      for (const size of selectedSizes) {
        const shoes = this.formGroup?.get('shoes')?.value
        const brand = this.formGroup?.get('brand')?.value
        const variant: ShoesDetail = {
          shoes: { id: shoes.id, name: shoes.name },
          status: this.formGroup?.get('checked')?.value == false ? 0 : 1,
          quantity: this.formGroup?.get('quantity')?.value,
          brand: { id: brand.id, name: brand.name },
          description: this.formGroup?.get('description')?.value,
          import_price: this.formGroup?.get('import_price')?.value,
          price: this.formGroup?.get('price')?.value,
          tax: this.formGroup?.get('tax')?.value,
          code: shoes.code + brand.code + color.code + size.code,
          color: { id: color.id, name: color.name },
          size: { id: size.id, name: size.name },
          images: this.formGroup?.get('images')?.value
        };
        console.log(variant);

        let isCodeFound = this.shoesVariantsList.some(v => v.code == variant.code);
        if (isCodeFound) {
          this.messageService.add({ severity: 'warning', summary: 'Exist', detail: 'Variants ' + variant.shoes.name + '-' + variant.brand.name + '[' + variant.color.name + '-' + variant.size.name + ']' + ' Existed', life: 3000 });
        } else {
          variants.push(variant);
          this.messageService.add({ severity: 'success', summary: 'Generate', detail: 'Variants ' + variant.shoes.name + '-' + variant.brand.name + '[' + variant.color.name + '-' + variant.size.name + ']' + ' Generated', life: 3000 });
        }
      }
    }

    return variants;
  }



  showTable() {
    if (this.formGroup.valid) {
      const selectedColors = this.formGroup?.get('color')?.value
      const selectedSizes = this.formGroup?.get('size')?.value
      this.shoeVariants = this.generateShoeVariants(selectedColors, selectedSizes);
      console.log(this.shoeVariants);
      this.displayTable = true;
    } else {
      this.markAllFormControlsAsTouched(this.formGroup)
      this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Variants Create Validate Error', life: 3000 });
    }
  }



  showMixedData() {
    const selectedColors = this.formGroup?.get('color')?.value
    const selectedSizes = this.formGroup?.get('size')?.value
    const shoeVariants: ShoesDetail[] = this.generateShoeVariants(selectedColors, selectedSizes);
    console.log(shoeVariants);
  }

  alertForm() {
    alert(JSON.stringify(this.formGroup.value));
    const selectedColors = this.formGroup?.get('color')?.value
    const selectedSizes = this.formGroup?.get('size')?.value
    const shoes = this.formGroup?.get('shoes')?.value
    console.log(shoes.id);
    console.log(selectedColors);
    console.log(selectedSizes);
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
        this.shoeVariants = this.shoeVariants.filter((val) => !this.selectedProducts?.includes(val));
        this.selectedProducts = null;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      }
    });
  }

  editProduct(product: ShoesDetail) {
    this.product = product;
    this.productDialog = true;
  }

  deleteProduct(product: ShoesDetail) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.shoes.name + '[' + product.color.name + ' - ' + product.size.name + ']' + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.shoeVariants = this.shoeVariants.filter((val) => val !== product);
        this.product = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;
    if (this.product) {
      this.shoeVariants[this.findIndexById(this.product)] = this.product;
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
    }
    this.shoeVariants = [...this.shoeVariants];
    this.productDialog = false;
    this.product = {};

  }

  findIndexById(product: ShoesDetail): number {
    let index = -1;
    for (let i = 0; i < this.shoeVariants.length; i++) {
      if (this.shoeVariants[i].code === product.code) {
        index = i;
        break;
      }
    }
    return index;
  }

  getSeverity(status: any) {
    switch (status) {
      case 1:
        return 'success';
      case 2:
        return 'warning';
      case 3:
        return 'danger';
      case 0:
        return 'danger';
    }
    return 'danger';
  }

  getStatus(status: number) {
    switch (status) {
      case 0:
        return "Not showing"
      case 1:
        return 'INSTOCK';
      case 2:
        return 'LOWSTOCK';
      case 3:
        return 'OUTOFSTOCK';
    }
    return 'not available';
  }

}
