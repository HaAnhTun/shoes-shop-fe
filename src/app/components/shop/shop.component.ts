import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('DV') dataView: DataView
  constructor(private http: HttpClient) {

   }



 ngAfterViewInit(): void {
  let paging = { first: 0, rows: 12};
  this.dataView.paginate(paging);
 }

  ngOnInit() {
    this.fetchProducts();
    
    
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
}
