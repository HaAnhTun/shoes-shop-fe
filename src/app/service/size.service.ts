import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SizeData } from '../model/Size';
import { Observable } from 'rxjs';
import { SizeSave } from '../model/AddSize';

@Injectable({
  providedIn: 'root'
})
export class SizeService {
  private apiUrl = 'http://localhost:8088/api/sizes';

  constructor(private http: HttpClient) { }

  getSize() {
    return this.http.get(this.apiUrl);
  }
  getSizeRemoved() {
    return this.http.get(this.apiUrl + '/removed');
  }
  editSize(Size: SizeData): Observable<SizeData> {
      const updateUrl = `${this.apiUrl}/${Size.id}`;
      return this.http.put<SizeData>(updateUrl, Size);
  }

  saveSize(Size: SizeSave): Observable<SizeData> {
      return this.http.post<SizeData>(this.apiUrl, Size);
    }
  
  deleteSize(id: number): Observable<any> {
    // Để xóa sản phẩm, gửi yêu cầu HTTP DELETE với id của sản phẩm cần xóa
    const deleteUrl = `${this.apiUrl}/${id}`;
    return this.http.delete(deleteUrl);
  }
}
