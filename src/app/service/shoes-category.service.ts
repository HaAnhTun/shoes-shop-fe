import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ShoesCategory } from "../model/ShoesCategory";

@Injectable({
  providedIn: "root",
})
export class ShoesCategoryService {
  private baseUrl: string = "http://localhost:8088/api/";
  constructor(private http: HttpClient) {}

  public getShoesCategories() {
    return this.http.get<any>(this.baseUrl + "shoes-categories", {
      withCredentials: true,
    });
  }
  public getShoesCategoryDetails(id: Number) {
    return this.http.get<any>(this.baseUrl + "shoes-categories/" + id, {
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
  search(searchText: String) {
    let search = {
      searchText: searchText,
    };
    return this.http.post<any>(
      this.baseUrl + "shoes-categories/search",
      search,
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
  update(shoesCategory: ShoesCategory) {
    return this.http.put<any>(
      this.baseUrl + "shoes-categories/" + shoesCategory.id,
      shoesCategory,
      {
        withCredentials: true,
      }
    );
  }
  delete(id: Number) {
    return this.http.delete<any>(this.baseUrl + "shoes-categories/" + id);
    console.log("ngonsss");
  }
}
