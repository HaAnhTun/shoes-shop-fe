import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/model/Product';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  layout: 'list' | 'grid' = 'list';

  constructor(private http: HttpClient) {}

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
