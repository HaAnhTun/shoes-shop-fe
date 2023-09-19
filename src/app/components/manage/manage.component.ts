import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/app/model/Product';
import { Category } from 'src/app/model/Category';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  products: Product[] = [];
  selectedProducts: Product[] = [];
  chartData: any[] | undefined;
  basicOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#black',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#black',
        },
        grid: {
          color: 'rgba(255,255,255,0.2)',
        },
      },
      y: {
        ticks: {
          color: '#black',
        },
        grid: {
          color: 'rgba(255,255,255,0.2)',
        },
      },
    },
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.http.get<Product[]>('http://localhost:3000/products').subscribe(
      (data) => {
        this.products = data;
        this.chartData = this.calculateCategoryCounts(this.products);
        console.log(data);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  calculateCategoryCounts(products: Product[]): any {
    const categoryCounts: { [category: string]: number } = {};
    for (const product of products) {
      for (const category of product.categories) {
        const categoryName = category.name;
        if (categoryCounts[categoryName]) {
          categoryCounts[categoryName] += 1;
        } else {
          categoryCounts[categoryName] = 1;
        }
      }
    }

    const chartData = {
      labels: Object.keys(categoryCounts),
      datasets: [
        {
          label: 'Category Counts',
          backgroundColor: '#42A5F5',
          data: Object.values(categoryCounts),
        },
      ],
    };

    return chartData;
  }

  openNew() {}

  deleteSelectedProducts() {}
  editProduct(product: Product) {}
  deleteProduct(product: Product) {}
}
