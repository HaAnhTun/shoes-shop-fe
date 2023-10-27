import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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
@Component({
  selector: 'app-shoes-detail-add',
  templateUrl: './shoes-detail-add.component.html',
  styleUrls: ['./shoes-detail-add.component.css'],

})
export class ShoesDetailAddComponent {
  countries: any[] | undefined;
  shoeVariants: ShoesDetail[];
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

  product!: any;

  selectedProducts!: any[] | null;

  submitted: boolean = false;

  statuses!: any[];

  formGroup: FormGroup;

  checked: boolean = false;

  shoes_detail: ShoesDetail
  displayTable: boolean = false;

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService, private http: HttpClient, private route: Router,) { }

  ngOnInit() {
    this.http.get<any>(AppConstants.BASE_URL_API + "/api/shoes").subscribe((response) => { this.shoes = response });
    this.http.get<any>(AppConstants.BASE_URL_API + "/api/brands").subscribe((response) => { this.brands = response });
    this.http.get<any>(AppConstants.BASE_URL_API + "/api/sizes").subscribe((response) => { this.sizes = response });
    this.http.get<any>(AppConstants.BASE_URL_API + "/api/colors").subscribe((response) => { this.colors = response });
    this.statuses = [
      { label: 'INSTOCK', value: 1 },
      { label: 'LOWSTOCK', value: 2 },
      { label: 'OUTOFSTOCK', value: 3 },
      { label: 'Unknown', value: "" }
    ];
    this.formGroup = new FormGroup({
      shoes: new FormControl<object | null>(null),
      checked: new FormControl<boolean>(false),
      brand: new FormControl<object | null>(null),
      description: new FormControl<object | null>(null),
      import_price: new FormControl<object | null>(null),
      price: new FormControl<object | null>(null),
      tax: new FormControl<object | null>(null),
      color: new FormControl<object | null>(null),
      size: new FormControl<object | null>(null),
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
    const variants: ShoesDetail[] = [];

    for (const color of selectedColors) {
      for (const size of selectedSizes) {
        const shoes = this.formGroup?.get('shoes')?.value
        const brand = this.formGroup?.get('brand')?.value
        const variant: ShoesDetail = {
          shoes: { id: shoes.id, name: shoes.name },
          status: this.formGroup?.get('checked')?.value == true ? 1 : 0,
          quantity: 10,
          brand: { id: brand.id, name: brand.name },
          description: this.formGroup?.get('description')?.value,
          import_price: this.formGroup?.get('import_price')?.value,
          price: this.formGroup?.get('price')?.value,
          tax: this.formGroup?.get('tax')?.value,
          code: this.generateUniqueCode(),
          color: { id: color.id, name: color.name },
          size: { id: size.id, name: size.name },
        };
        variants.push(variant);
      }
    }

    return variants;
  }


  generateUniqueCode() {

    return 'SD002';
  }

  showTable() {
    if (this.formGroup.valid) {
      const selectedColors = this.formGroup?.get('color')?.value
      const selectedSizes = this.formGroup?.get('size')?.value
      this.shoeVariants = this.generateShoeVariants(selectedColors, selectedSizes);
      this.displayTable = true;
    } else {
      this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Product Create Error', life: 3000 });
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
    this.product = { ...product };
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
    if (this.product.name?.trim()) {
      if (this.product) {
        this.shoeVariants[this.findIndexById(this.product)] = this.product;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
      }
      this.shoeVariants = [...this.shoeVariants];
      this.productDialog = false;
      this.product = {};
    }
  }

  findIndexById(product: ShoesDetail): number {
    let index = -1;
    for (let i = 0; i < this.shoeVariants.length; i++) {
      if (this.shoeVariants[i] === product) {
        index = i;
        break;
      }
    }
    return index;
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
