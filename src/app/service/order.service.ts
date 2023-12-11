import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OrderSearchReq } from "../model/OrderSearchReq";
@Injectable({
  providedIn: "root",
})
export class OrderService {
  constructor(private http: HttpClient) {}
  baseUrl: string = "http://localhost:8088/api/orders";
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
  public saveOrder(data: any) {
    return this.http.post<any>(this.baseUrl, data, {
      withCredentials: true,
    });
  }
  public verifyOrder(data: any[]) {
    return this.http.post<any>(this.baseUrl + "/verifyOrder", data, {
      withCredentials: true,
    });
  }
  public updateStatus(data: number) {
    return this.http.get<any>(this.baseUrl + "/update-status/" + data, {
      withCredentials: true,
    });
  }
  public getOrder(data: number) {
    return this.http.get<any>(this.baseUrl + "/" + data, {
      withCredentials: true,
    });
  }
  public cancelOrder(data: any[]) {
    return this.http.get<any>(this.baseUrl + "/cancel/" + data, {
      withCredentials: true,
    });
  }
  public getOrderDetailByOrderCode(data: string){
    return this.http.get<any>(this.baseUrl+"/"+data+"/details",{
      withCredentials: true,
    })
  }
}
