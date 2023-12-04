import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { error } from "console";

@Component({
  selector: "app-order-return-details",
  templateUrl: "./order-return-details.component.html",
  styleUrls: ["./order-return-details.component.css"],
})
export class OrderReturnDetailsComponent implements OnInit {
  orderReturn: any;
  orderReturnId: number;
  constructor(private http: HttpClient, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.orderReturnId = Number(this.route.snapshot.paramMap.get("id"));
    this.http
      .get("http://localhost:8088/api/order-returns/" + this.orderReturnId)
      .subscribe(
        (res) => {
          this.orderReturn = res;
          console.log(this.orderReturn);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
