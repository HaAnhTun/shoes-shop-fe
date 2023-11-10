import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Product } from 'src/app/model/Product';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  layout: 'list' | 'grid' = 'grid';
  @ViewChild('dv') dataView: DataView
  sortOptions: SelectItem[];

  sortOrder: number;
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    // Add more items as needed
  ];
  shoeSizes = [
    'US 5', 'US 6', 'US 7', 'US 8', 'US 9', 'US 10',
    // Add more sizes as needed
  ];

  selectedItems: any[] = [];
  sortField: string;
  constructor(private http: HttpClient) {

  }
  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  ngAfterViewInit(): void {
    let paging = { first: 0, rows: 12 };
    this.dataView.paginate(paging);
  }

  ngOnInit() {
    this.fetchProducts();
    this.sortOptions = [
      { label: 'Giá từ cao tới thấp', value: '!price' },
      { label: 'Giá từ thấp tới cao', value: 'price' },
      { label: 'Tên từ A -> Z', value: '!name' },
      { label: 'Tên từ Z -> A', value: 'name' }
    ];

  }

  fetchProducts() {
    this.http.get<any>('http://localhost:3000/products').subscribe(
      (data) => {
        this.products = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  value!: any;

  paymentOptions: any[] = [
    { name: 'Option 1', value: 1 },
    { name: 'Option 2', value: 2 },
    { name: 'Option 3', value: 3 },
    { name: 'Option 1', value: 11 },
    { name: 'Option 2', value: 22 },
    { name: 'Option 3', value: 32 },
    { name: 'Option 1', value: 33 },
    { name: 'Option 2', value: 221 },
    { name: 'Option 3', value: 31 }
  ];
  rangeValues: number[] = [100000, 100000000
  ];
  brandOptions: any[] = [
    { label: 'Nike', value: 'nike' },
    { label: 'Adidas', value: 'adidas' },
    { label: 'Puma', value: 'puma' },
    { label: 'Reebok', value: 'reebok' },
  ];

  selectedBrand: string = 'nike'; 

  calle() {
    console.log(this.value);

  }
  calle2() {
    console.log(this.selectedBrand);

  }
  loge(){
    console.log(this.rangeValues);
  }
}
