import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { error } from "console";
import { OrderService } from "src/app/service/order.service";

@Component({
  selector: "app-order-return-details",
  templateUrl: "./order-return-details.component.html",
  styleUrls: ["./order-return-details.component.css"],
})
export class OrderReturnDetailsComponent implements OnInit {
  orderReturn: any;
  orderReturnId: number;
  order: any;
  request: any = {
    id: "",
    list: []
  }
  constructor(private http: HttpClient, private route: ActivatedRoute,private orderService: OrderService) {}
  ngOnInit(): void {
    this.orderReturnId = Number(this.route.snapshot.paramMap.get("id"));
    this.http
      .get("http://localhost:8088/api/order-returns/" + this.orderReturnId)
      .subscribe(
        (res) => {
          this.orderReturn = res;
          console.log(this.orderReturn);
          let orderId = this.orderReturn.order.id;
          this.orderService.getOrder(orderId).subscribe((res) => {
            this.order = res;
          });
          this.request.id = this.orderReturn.id;
          this.request.list = this.orderReturn.orderReturnDetailsDTOS
          console.log(this.request)
        },
        (error) => {
          console.log(error);
        }
      );
  }
  verifyOrderReturn(){
    this.http.post("http://localhost:8088/api/order-returns/verify",this.request).subscribe((res)=>{
      console.log(res);
    })
  }
  cancelOrderReturn(id:number){
    this.http.get("http://localhost:8088/api/order-returns/cancel/" + id).subscribe((res)=>{
      console.log(res);
    })
  }
}


