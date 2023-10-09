import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConstants } from "../../app-constants";
import { Login } from "src/app/dto/login";
import { LoginService } from "src/app/service/login.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loginUser:Login = new Login();

  constructor(
    private router: Router,
    public http: HttpClient,
    private loginservice: LoginService
  ) { }

  isValid = true;

  ngOnInit(): void {
    sessionStorage.removeItem("access_token");
    if (this.router.url === "/logout") {
      this.router.navigate(["login"]);
    }
  }

  onLogin() {}

  login() {
    this.loginservice.login(this.loginUser).subscribe(
      {
        next: (body: any) => {
          if (body && body?.id_token) {
            sessionStorage.setItem("access_token", body?.id_token);
            // this.router.navigate(['home']);
          } else {
            this.isValid = false;
          }
        },
        error: (error) => {
          console.error(error);
          this.router.navigate(['error'])
        }
      }
    )
  }
  clickOauth2(): void {
    location.replace(
      AppConstants.BASE_URL_API + "/oauth2/authorization/google"
    );
  }
}
