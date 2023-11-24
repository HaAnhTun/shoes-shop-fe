import { Injectable } from "@angular/core";
@Injectable({
  providedIn: "root",
})
export class CartDetailCustomerService {
  private cartDetailCustomerService: any[] = [];

  constructor() {}

  setCartDetailCustomerService(cartDetailCustomer: any[]) {
    this.cartDetailCustomerService = cartDetailCustomer;
  }

  getCartDetailCustomerService(): any[] {
    return this.cartDetailCustomerService;
  }
}
