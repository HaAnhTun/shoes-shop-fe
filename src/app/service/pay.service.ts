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
    province: number,
    district: number,
    ward: number,
    shipPrice: number,
    idOwner: number,
    arrSanPham: string,
    arrQuantity: string,
    arrPriceDiscount: string
  ): Observable<string>{
    let params = new HttpParams()
    .set('price', price.toString())
    .set('receivedBy', receivedBy)
    .set('phone', phone)
    .set('email', email)
    .set('address', address)
    .set('province', province.toString())
    .set('district', district.toString())
    .set('ward', ward.toString())
    .set('shipPrice', shipPrice.toString())
    .set('idOwner', idOwner)
    .set('arrSanPham', arrSanPham)
    .set('arrQuantity', arrQuantity)
    .set('arrPriceDiscount', arrPriceDiscount);
    return this.http.get("http://localhost:8088/api/create-payment", {
      params,
      responseType: 'text',
    });
  }
}
