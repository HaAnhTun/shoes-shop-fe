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
    return this.http.get<any>(this.baseUrl + "/order-owner/" + id, {
      withCredentials: true,
    })
  }

  getOrderByStatusAndOwnerLogin(status : Number, login : string){
    console.log(this.baseUrl + "/users/find?status=" + status + '&login=' + login)
    return this.http.get<any>(this.baseUrl + "/users/find?status=" + status + '&login=' + login)
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

  checkEmail(email:any):Observable<any>{
    return this.http.post<any>(this.baseUrl + '/account/check', email, {
      withCredentials: true,
    });
  }
  changePassword(email:any):Observable<any>{
    return this.http.post<any>(this.baseUrl + '/account/reset-password/init', email, {
      withCredentials: true,
    });
  }
  checkResetKey(key:any):Observable<any>{
    return this.http.post<any>(this.baseUrl + '/account/checkResetKey', key, {
      withCredentials: true,
    });
  }

  newPassword(keyAndPassword: any):Observable<any>{
    return this.http.post<any>(this.baseUrl + "/account/reset-password/finish", keyAndPassword);
  }
}
