import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShoesCategory } from '../model/ShoesCategory';

@Injectable({
  providedIn: 'root'
})
export class ShoesCategoryService{
  private baseUrl: string = 'http://localhost:8088/api/shoes-categories';
  constructor(private http : HttpClient) {
   }

   getShoesCategories(){
    
    return this.http.get<any>(this.baseUrl,{ withCredentials: true })
   }
}
