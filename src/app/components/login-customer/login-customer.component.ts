import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { AppConstants } from "src/app/app-constants";
import { Login } from "src/app/dto/login";
import { LoginService } from "src/app/service/login.service";
import { CartDetailCustomerService } from "src/app/service/cartdetailcustom.service";

@Component({
  selector: "app-login-customer",
  templateUrl: "./login-customer.component.html",
  styleUrls: ["./login-customer.component.css"],
})
export class LoginCustomerComponent {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    public http: HttpClient,
    private loginservice: LoginService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private cartDetailCustomerService: CartDetailCustomerService
  ) {
    this.loginForm = this.fb.group({
      login: ["", Validators.required],
      passwordHash: ["", Validators.required],
    });
  }

  isValid = true;

  ngOnInit(): void {
    if (sessionStorage.getItem("access_token") != null) {
      this.cartDetailCustomerService.setData("0");
      sessionStorage.clear();
    }
    if (this.router.url === "/logout") {
      this.router.navigate(["login"]);
    }
  }

  login() {
    const user = this.loginForm.value;
    this.loginservice.login(user).subscribe({
      next: (body: any) => {
        if (body && body?.id_token) {
          sessionStorage.setItem("access_token", body?.id_token);
          this.router.navigate(["client/home"]);
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
    sessionStorage.setItem("oathu2", "oathu2");
    location.replace(
      AppConstants.BASE_URL_API + "/oauth2/authorization/google"
    );
  }
}
