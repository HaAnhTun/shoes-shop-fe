import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";
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

  onLogin() {

  }

  login() {
    var form = {
      password: "admin"
      , username: "admin"
    }

    if (form.username && form.password) {
      this.http.post(AppConstants.BASE_URL_API + "/api/authenticate", JSON.stringify(form)).subscribe(
        {
          next: (body: any) => {
            if (body && body?.id_token) {
              sessionStorage.setItem("access_token", body?.id_token);
              this.router.navigate(['home']);
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
