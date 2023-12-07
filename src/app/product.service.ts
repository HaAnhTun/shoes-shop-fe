import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private apiURL = "http://localhost:8088/api/shoes-details/shop";

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.post<any[]>(this.apiURL, {
      sizeIds: [],
      brandId: null,
      startPrice: 1,
      endPrice: 10000000,
    });
  }
}
