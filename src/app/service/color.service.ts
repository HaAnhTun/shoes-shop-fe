import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ColorData } from '../model/Color';
import { Observable } from 'rxjs';
import { ColorSave } from '../model/AddColor';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private apiUrl = 'http://localhost:8088/api/colors';

  constructor(private http: HttpClient) { }

  getColor() {
    return this.http.get(this.apiUrl);
  }

  getColorRemoved() {
    return this.http.get(this.apiUrl + '/removed');
  }
  editColor(Color: ColorData): Observable<ColorData> {
      const updateUrl = `${this.apiUrl}/${Color.id}`;
      return this.http.put<ColorData>(updateUrl, Color);
  }

  saveColor(Color: ColorSave): Observable<ColorData> {
      return this.http.post<ColorData>(this.apiUrl, Color);
    }
  
  deleteColor(id: number): Observable<any> {
    // Để xóa sản phẩm, gửi yêu cầu HTTP DELETE với id của sản phẩm cần xóa
    const deleteUrl = `${this.apiUrl}/${id}`;
    return this.http.delete(deleteUrl);
  }
}
