import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Product } from 'src/app/model/Product';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  products: Product[] = [];
  responsiveOptions: any;
  subscription!: Subscription;
  constructor(
    private http: HttpClient,
    public layoutService: LayoutService,
    private loginService: LoginService
  ) {
    this.subscription = this.layoutService.configUpdate$.subscribe(() => {
      this.fetchProducts();
    });
    this.responsiveOptions = [
      {
        breakpoint: "1900px",
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: "768px",
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: "560px",
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  ngOnInit() {
    this.fetchProducts();
    if (sessionStorage.getItem("access_token") == null) {
      this.loginService.ouath2().subscribe({
        next: (body: any) => {
          if (body && body?.id_token) {
            sessionStorage.setItem("access_token", body?.id_token);
          }
        },
      });
    }
  }

  fetchProducts() {
    this.http.get<any>("http://localhost:3000/products").subscribe(
      (data) => {
        this.products = data;
        console.log(data);
      },
      (error) => {
        console.error("Error fetching products:", error);
      }
    );
  }
}