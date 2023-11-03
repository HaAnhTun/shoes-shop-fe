import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OrderSearchReq } from "../model/OrderSearchReq";
@Injectable({
  providedIn: "root",
})
export class OrderService {
  constructor(private http: HttpClient) {}
  baseUrl: String = "http://localhost:8088/api/orders";
  public getOrders(orderSearchReq: OrderSearchReq) {
    return this.http.post<any>(this.baseUrl + "/search", orderSearchReq, {
      withCredentials: true,
    });
  }
  public getOrderQuantity() {
    return this.http.get<any>(this.baseUrl + "/quantity", {
      withCredentials: true,
    });
  }
}
