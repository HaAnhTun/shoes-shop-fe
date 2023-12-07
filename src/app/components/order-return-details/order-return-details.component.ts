import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { error } from "console";
import {
  ConfirmEventType,
  ConfirmationService,
  MessageService,
} from "primeng/api";
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
    list: [],
  };
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
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
          this.request.list = this.orderReturn.orderReturnDetailsDTOS;
          console.log(this.request);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  verifyOrderReturn() {
    this.confirmationService.confirm({
      message: "Xác nhận yêu cầu đổi trả?",
      header: "Xác nhận",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.http
          .post("http://localhost:8088/api/order-returns/verify", this.request)
          .subscribe((res) => {
            setTimeout(() => {
              this.messageService.add({
                severity: "success",
                summary: "Thành công",
                detail: "Xác nhận yêu cầu thành công!",
              });
              this.router.navigate(["/admin/order-returns"]);
            }, 1000);
          });
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: "error",
              summary: "Từ chối",
              detail: "Bạn vừa từ chối",
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: "warn",
              summary: "Cancelled",
              detail: "You have cancelled",
            });
            break;
        }
      },
    });
  }
  cancelOrderReturn(id: number) {
    this.confirmationService.confirm({
      message: "Hủy yêu cầu đổi trả?",
      header: "Xác nhận",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.http
          .get("http://localhost:8088/api/order-returns/cancel/" + id)
          .subscribe((res) => {
            this.messageService.add({
              severity: "success",
              summary: "Thành công",
              detail: "Hủy yêu cầu thành công!",
            });
            setTimeout(() => {
              this.router.navigate(["/admin/order-returns"]);
            }, 1000);
          });
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: "error",
              summary: "Từ chối",
              detail: "Bạn vừa từ chối",
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: "warn",
              summary: "Cancelled",
              detail: "You have cancelled",
            });
            break;
        }
      },
    });
  }
}
