import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConstants } from "../../app-constants";
import { Login } from "src/app/dto/login";
import { LoginService } from "src/app/service/login.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loginUser: Login = new Login();

  constructor(
    private router: Router,
    public http: HttpClient,
    private loginservice: LoginService,
    private messageService: MessageService
  ) {}

  isValid = true;

  ngOnInit(): void {
    sessionStorage.removeItem("access_token");
    if (this.router.url === "/logout") {
      this.router.navigate(["login"]);
    }
  }

  onLogin() {}

  login() {
    this.loginservice.login(this.loginUser).subscribe({
      next: (body: any) => {
        if (body && body?.id_token) {
          sessionStorage.setItem("access_token", body?.id_token);
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Đăng nhập Thành công",
            life: 3000,
          });
          setTimeout(()=>{
            this.router.navigate(["admin/users"]);
          }, 2000)
        } else {
          this.isValid = false;
        }
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Đăng nhập thất bại.",
          life: 3000,
        });
      },
    });
  }
}
