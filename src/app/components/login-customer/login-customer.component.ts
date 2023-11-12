import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppConstants } from 'src/app/app-constants';
import { Login } from 'src/app/dto/login';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-login-customer',
  templateUrl: './login-customer.component.html',
  styleUrls: ['./login-customer.component.css']
})
export class LoginCustomerComponent {
  loginForm : FormGroup;

  constructor(
    private router: Router,
    public http: HttpClient,
    private loginservice: LoginService,
    private messageService: MessageService,
    private fb : FormBuilder
  ) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      passwordHash: ['', Validators.required]
    })
  }

  isValid = true;

  ngOnInit(): void {
    sessionStorage.removeItem("access_token");
    if (this.router.url === "/logout") {
      this.router.navigate(["login"]);
    }
  }

  login() {
    const user = this.loginForm.value;
    console.log(user)
    this.loginservice.login(user).subscribe({
      next: (body: any) => {
        if (body && body?.id_token) {
          sessionStorage.setItem("access_token", body?.id_token);
          this.router.navigate(["admin/users"]);
        } else {
          this.isValid = false;
        }
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Login Error",
          life: 3000,
        });
      },
    });
  }
  clickOauth2(): void {
    location.replace(
      AppConstants.BASE_URL_API + "/oauth2/authorization/google"
    );
  }
}
