import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Login } from "../dto/login";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private baseUrl: string = "http://localhost:8088/api/authenticate";
  private baseUrl1: string = "http://localhost:8088/api/registerOauth2";
  constructor(private httpClient: HttpClient) {}
  login(login: Login): Observable<object> {
    return this.httpClient.post(this.baseUrl, login);
  }
  ouath2(): Observable<object> {
    return this.httpClient.get(this.baseUrl1, { withCredentials: true });
  }
  
  decodeJwtToken(token: string) {
    const tokenParts = token.split('.');
  
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token structure');
    }
  
    const base64Url = tokenParts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
  
    return payload;
  }


}
