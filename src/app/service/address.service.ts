import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class AddressService {
  constructor(private http: HttpClient) {}
  baseAddress = "https://provinces.open-api.vn/api";
  public getProvines() {
    return this.http.get<any>(this.baseAddress + "/p/");
  }
  public getDistrict(code: number) {
    return this.http.get<any>(this.baseAddress + "/p/" + code + "?depth=2");
  }
  public getWards(code: number) {
    return this.http.get<any>(this.baseAddress + "/d/" + code + "?depth=2");
  }
}
