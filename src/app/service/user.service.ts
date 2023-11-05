import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = "http://localhost:8088/api/admin";
  constructor(private http : HttpClient) { }

  getAllUser(){
    return this.http.get<any>(this.baseUrl + "/users", {
      withCredentials: true,
    });
  }

  getOrderById(id:Number){
    return this.http.get<any>(this.baseUrl + "/order-owner/" + id, {
      withCredentials: true,
    })
  }

  save(user : any):Observable<any>{
    return this.http.post<any>(this.baseUrl + "/users", user, {
      withCredentials: true,
    });
  }

  update(user : any):Observable<any>{
    return this.http.put<any>(
      this.baseUrl +"/users", user,
      {
        withCredentials: true
      });
  }

  delete(user : any):Observable<any>{
    return this.http.delete<any>(this.baseUrl + "/users/" + user.login)
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = "http://localhost:8088/api/admin";
  constructor(private http : HttpClient) { }

  getAllUser(){
    return this.http.get<any>(this.baseUrl + "/users/activatedTrue", {
      withCredentials: true,
    });
  }

  getOrderById(id:Number){
    return this.http.get<any>(this.baseUrl + "/order-owner/" + id, {
      withCredentials: true,
    })
  }

  save(user : any):Observable<any>{
    return this.http.post<any>(this.baseUrl + "/users", user, {
      withCredentials: true,
    });
  }

  update(user : any):Observable<any>{
    return this.http.put<any>(
      this.baseUrl +"/users", user,
      {
        withCredentials: true
      });
  }

  delete(user : any):Observable<any>{
    return this.http.delete<any>(this.baseUrl + "/users/" + user.login)
  }
}
