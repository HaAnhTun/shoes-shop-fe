import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { AppConstants } from "../../app-constants";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private router: Router,
    public http: HttpClient
  ) { }

  isValid = true;

  ngOnInit(): void {
    sessionStorage.removeItem("access_token");
    if (this.router.url === '/logout') {
      this.router.navigate(['login']);
    }
  };

  login(form: NgForm) {
    if (form.value.username && form.value.password) {
      this.http.post(AppConstants.BASE_URL_API + "/login", JSON.stringify(form.value)).subscribe(
        {
          next: (body: any) => {
            if (body && body?.accessToken && body?.tokenType) {
              sessionStorage.setItem("access_token", body?.accessToken);
              sessionStorage.setItem("token_type", body?.tokenType);
              this.router.navigate(['user/list'])
            } else {
              this.isValid = false;
            }
          },
          error: (error) => {
            console.error(error);
            this.router.navigate(['error'])
          }
        }
      );
    } else {
      this.isValid = false;
    }
  }
}
