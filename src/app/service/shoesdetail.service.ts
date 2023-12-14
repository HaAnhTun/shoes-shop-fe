import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ShoesdetailService {
  private apiUrl: string = "http://localhost:8088/api/shoes-details/new";
  private apiUrl1: string =
    "http://localhost:8088/api/shoes-details/newDiscount";
  constructor(private http: HttpClient) {}

  getNewShoesDetail() {
    return this.http.get<any>(this.apiUrl, {
      withCredentials: true,
    });
  }

  getNewDiscountShoesDetail() {
    return this.http.get<any>(this.apiUrl1, {
      withCredentials: true,
    });
  }
}
