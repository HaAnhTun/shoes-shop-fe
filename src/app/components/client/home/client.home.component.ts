import { Component, OnInit } from "@angular/core";
import { LayoutService } from "src/app/layout/service/app.layout.service";
import { LoginService } from "src/app/service/login.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-client.home",
  templateUrl: "./client.home.component.html",
  styleUrls: ["./client.home.component.css"],
})
export class ClientHomeComponent implements OnInit {
  constructor(
    public layoutService: LayoutService,
    private loginService: LoginService,
    private router: Router
  ) {}
  ngOnInit(): void {
    if (
      sessionStorage.getItem("access_token") == null &&
      sessionStorage.getItem("oathu2") != null
    ) {
      this.loginService.ouath2().subscribe({
        next: (body: any) => {
          if (body && body?.id_token) {
            sessionStorage.setItem("access_token", body?.id_token);
            window.location.reload();
          }
        },
      });
    }
  }
}
