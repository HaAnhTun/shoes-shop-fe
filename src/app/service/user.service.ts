import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = "http://localhost:8088/api";
  constructor(private http : HttpClient) { }

  getAllUser(){
    return this.http.get<any>(this.baseUrl + "/admin/users/activatedTrue", {
      withCredentials: true,
    });
  }

  getOrderById(id:Number){
    return this.http.get<any>(this.baseUrl + "/admin/order-owner/" + id, {
      withCredentials: true,
    })
  }

  save(user : any):Observable<any>{
    return this.http.post<any>(this.baseUrl + "/admin/users", user, {
      withCredentials: true,
    });
  }

  update(user : any):Observable<any>{
    return this.http.put<any>(
      this.baseUrl +"/admin/users", user,
      {
        withCredentials: true
      });
  }

  delete(user : any):Observable<any>{
    return this.http.delete<any>(this.baseUrl + "/admin/users/" + user.login)
  }

  emailExist(email : any):Observable<any>{
    return this.http.get(this.baseUrl + '/email-exist/' + email);
  }

  usernameExist(login : any):Observable<any>{
    return this.http.get(this.baseUrl + '/username-exist/' + login);
  }
}
