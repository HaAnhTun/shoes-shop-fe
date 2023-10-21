import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private baseUrl:string = "http://localhost:8088/api/register";

  constructor(private httpClient : HttpClient) { }


  registion(user : any):Observable<any>{
    return this.httpClient.post(this.baseUrl, user);
  }
}
