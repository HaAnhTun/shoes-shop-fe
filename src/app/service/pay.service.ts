import { HttpClient, HttpHandler, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayService {

  constructor(private http: HttpClient) { }

  public createPayment(
    price: Number,
    receivedBy: string,
    phone: string,
    email: string,
    address: string,
    shipPrice: number,
    idOwner: number,
    arrSanPham: string,
    arrQuantity: string
  ): Observable<string>{
    let params = new HttpParams()
    .set('price', price.toString())
    .set('receivedBy', receivedBy)
    .set('phone', phone)
    .set('email', email)
    .set('address', address)
    .set('shipPrice', shipPrice.toString())
    .set('idOwner', idOwner)
    .set('arrSanPham', arrSanPham)
    .set('arrQuantity', arrQuantity);
    return this.http.get("http://localhost:8088/api/create-payment", {
      params,
      responseType: 'text',
    });
  }
}
