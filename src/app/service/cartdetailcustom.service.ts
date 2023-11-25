import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class CartDetailCustomerService {
  private cartDetailCustomerService: any[] = [];

  private dataSubject = new BehaviorSubject<string>("");

  setData(data: string) {
    this.dataSubject.next(data);
  }

  getData() {
    return this.dataSubject.asObservable();
  }

  constructor() {}

  setCartDetailCustomerService(cartDetailCustomer: any[]) {
    this.cartDetailCustomerService = cartDetailCustomer;
  }

  getCartDetailCustomerService(): any[] {
    return this.cartDetailCustomerService;
  }
}
