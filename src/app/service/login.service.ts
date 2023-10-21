import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../dto/login';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl:string = 'http://localhost:8088/api/authenticate';
  constructor(private httpClient: HttpClient) { }
  login(login: Login):Observable<object>{
    return this.httpClient.post(this.baseUrl, login);
  }
}
