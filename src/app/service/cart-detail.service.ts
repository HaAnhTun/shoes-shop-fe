import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CartDetail } from "../model/CartDetail";

@Injectable({
  providedIn: "root",
})
export class CartDetailService {
  private apiUrl = "http://localhost:8088/api/cart-details/";

  constructor(private http: HttpClient) {}

  getAllCartDetail() {
    return this.http.get<any>(this.apiUrl + "all", {
      withCredentials: true,
    });
  }

  editQuanity(soluong: number, id: number) {
    return this.http.put<number>(
      this.apiUrl + "add-quantity/" + soluong + "/" + id,
      {
        withCredentials: true,
      }
    );
  }

  addQuanity(id: number) {
    return this.http.put<number>(this.apiUrl + "add-quantity/" + id, {
      withCredentials: true,
    });
  }

  reduceQuanity(id: number) {
    return this.http.put<number>(this.apiUrl + "reduce-quantity/" + id, {
      withCredentials: true,
    });
  }

  saveCartDetail(cartDetail: CartDetail): Observable<CartDetail> {
    return this.http.post<CartDetail>(this.apiUrl, cartDetail);
  }

  deleteCartDetail(id: number) {
    // Để xóa sản phẩm, gửi yêu cầu HTTP DELETE với id của sản phẩm cần xóa
    return this.http.delete<any>(this.apiUrl + id, {
      withCredentials: true,
    });
  }

  getCartDetailById(id: number) {
    return this.http.get<any>(this.apiUrl + id, {
      withCredentials: true,
    });
  }
}
