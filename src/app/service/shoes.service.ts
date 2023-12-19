import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Shoes } from '../model/Shoes';
import { Observable } from 'rxjs';
import { ShoesSave } from '../model/AddShoes';

@Injectable({
  providedIn: 'root'
})
export class ShoesService {
  private apiUrl = 'http://localhost:8088/api/shoes';

  constructor(private http: HttpClient) { }

  getShoes() {
    return this.http.get(this.apiUrl);
  }

  getShoesRemoved() {
    return this.http.get(this.apiUrl + '/removed');
  }

  editShoes(Shoes: Shoes): Observable<Shoes> {
      const updateUrl = `${this.apiUrl}/${Shoes.id}`;
      return this.http.put<Shoes>(updateUrl, Shoes);
  }

  saveShoes(Shoes: ShoesSave): Observable<Shoes> {
      return this.http.post<Shoes>(this.apiUrl, Shoes);
    }
  
  deleteShoes(id: number): Observable<any> {
    // Để xóa sản phẩm, gửi yêu cầu HTTP DELETE với id của sản phẩm cần xóa
    const deleteUrl = `${this.apiUrl}/${id}`;
    return this.http.delete(deleteUrl);
  }
}
