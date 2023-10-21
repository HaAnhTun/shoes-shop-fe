import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ShoesCategory } from "../model/ShoesCategory";

@Injectable({
  providedIn: "root",
})
export class ShoesCategoryService {
  private baseUrl: string = "http://localhost:8088/api/";
  constructor(private http: HttpClient) {}

  getShoesCategories() {
    return this.http.get<any>(this.baseUrl + "shoes-categories", {
      withCredentials: true,
    });
  }
  getShoesCategoryValue(id: Number) {
    return this.http.get<any>(
      this.baseUrl + "shoes-category-values/category/" + id,
      {
        withCredentials: true,
      }
    );
  }
  save(shoesCategory: ShoesCategory) {
    return this.http.post<any>(
      this.baseUrl + "shoes-categories",
      shoesCategory,
      {
        withCredentials: true,
      }
    );
  }
}
