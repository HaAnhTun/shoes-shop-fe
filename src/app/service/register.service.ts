import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private baseUrl:string = "http://localhost:8088/api/";

  constructor(private httpClient : HttpClient) { }


  registion(user : any):Observable<any>{
    return this.httpClient.post(this.baseUrl + 'register', user);
  }

  emailExist(email : any):Observable<any>{
    console.log(this.baseUrl + 'email-exist/' + email)
    return this.httpClient.get(this.baseUrl + 'email-exist/' + email);
  }

  usernameExist(login : any):Observable<any>{
    return this.httpClient.get(this.baseUrl + 'username-exist/' + login);
  }
}
