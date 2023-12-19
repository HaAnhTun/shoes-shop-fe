import { Component, OnInit } from "@angular/core";
import {
  ConfirmationService,
  MessageService,
  ConfirmEventType,
} from "primeng/api";
import { Router } from "@angular/router";
import { CartDetail } from "src/app/model/CartDetail";
import { CartDetailCustom } from "src/app/model/CartDetailCustom";
import { CartDetailService } from "src/app/service/cart-detail.service";
import { CartDetailCustomerService } from "src/app/service/cartdetailcustom.service";
import { map } from "rxjs";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
  providers: [ConfirmationService, MessageService],
})
export class CartComponent implements OnInit {
  cartDetails: CartDetailCustom[] = [];
  cartDetailsChange: CartDetailCustom[] = [];
  cartDetailCustom: CartDetailCustom;
  cartDetail: CartDetail;
  tongTien: number = 0;
  cartDetailCustoms: any[] = [];
  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cartDetailService: CartDetailService,
    private cartDetailCustomerService: CartDetailCustomerService
  ) {}
  ngOnInit() {
    if (sessionStorage.getItem("access_token") != null) {
      this.cartDetailService.getAllCartDetailPath().subscribe((Response) => {
        console.log(Response);
        this.cartDetails = Response;
        this.cartDetails
          .filter((c) => c.quantity > c.quantityShoesDetail)
          .forEach((c) => (c.status = 0));
      });
    } else {
      if (sessionStorage.getItem("cartDetailCustom") != null) {
        if (sessionStorage.getItem("cartDetailCustoms") === null) {
          let cartDetailCustom = sessionStorage.getItem("cartDetailCustom");
          if (cartDetailCustom) {
            let data = JSON.parse(cartDetailCustom);
            this.cartDetails.push(data);
            this.cartDetails
              .filter((c) => c.quantity > c.quantityShoesDetail)
              .forEach((c) => (c.status = 0));
            this.cartDetailCustomerService.setData(
              "" + this.cartDetails.length
            );
            sessionStorage.removeItem("cartDetailCustom");
            sessionStorage.setItem(
              "cartDetailCustoms",
              JSON.stringify(this.cartDetails)
            );
          }
        } else {
          let cartDetailCustom = sessionStorage.getItem("cartDetailCustom");
          if (cartDetailCustom) {
            let cartDetailCustoms = sessionStorage.getItem("cartDetailCustoms");
            if (cartDetailCustoms) {
              let datas = JSON.parse(cartDetailCustoms);
              this.cartDetails = datas;
            }
            let data = JSON.parse(cartDetailCustom);
            let check = null;
            this.cartDetails
              .filter((c) => c.id === data.id)
              .forEach(
                (c) => (check = c.quantity = c.quantity + data.quantity)
              );
            if (check === null) {
              this.cartDetails.push(data);
            }
            this.cartDetails
              .filter((c) => c.quantity > c.quantityShoesDetail)
              .forEach((c) => (c.status = 0));
            sessionStorage.removeItem("cartDetailCustom");
            this.cartDetailCustomerService.setData(
              "" + this.cartDetails.length
            );
            sessionStorage.setItem(
              "cartDetailCustoms",
              JSON.stringify(this.cartDetails)
            );
          }
        }
      } else {
        let cartDetailCustoms = sessionStorage.getItem("cartDetailCustoms");
        if (cartDetailCustoms) {
          let datas = JSON.parse(cartDetailCustoms);
          this.cartDetails = datas;
          this.cartDetails
            .filter((c) => c.quantity > c.quantityShoesDetail)
            .forEach((c) => (c.status = 0));
          this.cartDetails.forEach((c) => (c.checkBox = false));
          this.cartDetailCustomerService.setData("" + this.cartDetails.length);
        }
      }
    }
  }
  addQuanity(id: number) {
    if (sessionStorage.getItem("access_token") != null) {
      let check = null;
      this.cartDetails
        .filter((c) => c.id === id && c.quantity < c.quantityShoesDetail)
        .forEach(
          (c) =>
            (check = this.cartDetailService.addQuanity(id).subscribe(() => {
              c.quantity = c.quantity + 1;
              this.loadTotalPrice();
            }))
        );
      if (check === null) {
        this.messageService.add({
          severity: "warn",
          summary: "Thông báo",
          detail: "Số lượng đã vượt quá số lượng tồn không thể thêm số lượng",
          life: 3000,
        });
      }
    } else {
      let quanity = 0;
      this.cartDetails
        .filter((c) => c.id === id && c.quantity < c.quantityShoesDetail)
        .forEach((c) => (quanity = c.quantity = c.quantity + 1));
      this.loadTotalPrice();
      if (quanity === 0) {
        this.messageService.add({
          severity: "warn",
          summary: "Thông báo",
          detail: "Số lượng đã vượt quá số lượng tồn không thể thêm số lượng",
          life: 3000,
        });
      }
      {
        sessionStorage.setItem(
          "cartDetailCustoms",
          JSON.stringify(this.cartDetails)
        );
      }
    }
  }
  reduceQuantity(id: number) {
    if (sessionStorage.getItem("access_token") != null) {
      let check = null;
      this.cartDetails
        .filter((c) => c.id === id && c.quantity > 1)
        .forEach(
          (c) =>
            (check = this.cartDetailService.reduceQuanity(id).subscribe(() => {
              c.quantity = c.quantity - 1;
              this.cartDetails
                .filter(
                  (c) =>
                    c.id === id &&
                    c.quantity > 1 &&
                    c.status === 0 &&
                    c.quantity <= c.quantityShoesDetail
                )
                .map((c) => (c.status = 1));
              this.loadTotalPrice();
            }))
        );
      if (check === null) {
        this.deleteProductCart(id);
        this.loadTotalPrice();
      }
    } else {
      let quanity = 0;
      this.cartDetails
        .filter((c) => c.id === id && c.quantity > 1)
        .forEach((c) => (quanity = c.quantity = c.quantity - 1));
      sessionStorage.setItem(
        "cartDetailCustoms",
        JSON.stringify(this.cartDetails)
      );
      this.cartDetails
        .filter(
          (c) =>
            c.id === id &&
            c.quantity > 1 &&
            c.status === 0 &&
            c.quantity <= c.quantityShoesDetail
        )
        .map((c) => (c.status = 1));
      this.loadTotalPrice();
      if (quanity === 0) {
        this.deleteProductCart(id);
        this.loadTotalPrice();
      }
    }
  }
  deleteProductCart(id: number) {
    if (sessionStorage.getItem("access_token") != null) {
      this.confirmationService.confirm({
        message: "Bạn có chắc muốn xóa không?",
        header: "Xóa",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.cartDetailService.deleteCartDetail(id).subscribe((data) => {
            this.cartDetails = this.cartDetails.filter((item) => item.id != id);
            this.loadTotalPrice();
            this.cartDetailService.getCount().subscribe((Response) => {
              this.cartDetailCustomerService.setData(Response);
            });
            this.messageService.add({
              severity: "info",
              summary: "Đã xác nhận",
              detail: "Xóa thành công",
              life: 3000,
            });
          });
        },
        reject: (type: ConfirmEventType) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              this.messageService.add({
                severity: "error",
                summary: "Hủy",
                detail: "Xóa không thành công",
                life: 3000,
              });
              break;
          }
        },
      });
    } else {
      this.confirmationService.confirm({
        message: "Bạn có chắc muốn xóa không?",
        header: "Xóa",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.cartDetails = this.cartDetails.filter((item) => item.id != id);
          this.loadTotalPrice();
          this.cartDetailCustomerService.setData("" + this.cartDetails.length);
          sessionStorage.setItem(
            "cartDetailCustoms",
            JSON.stringify(this.cartDetails)
          );
          this.messageService.add({
            severity: "info",
            summary: "Đã xác nhận",
            detail: "Xóa thành công",
            life: 3000,
          });
        },
        reject: (type: ConfirmEventType) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              this.messageService.add({
                severity: "error",
                summary: "Hủy",
                detail: "Xóa không thành công",
                life: 3000,
              });
              break;
          }
        },
      });
    }
  }
  checkboxAll() {
    let checkFalse = null;
    this.cartDetails
      .filter((c) => c.checkBox === false || c.checkBox === undefined)
      .map(() => (checkFalse = false));
    if (checkFalse === false) {
      this.cartDetails.forEach((c) => (c.checkBox = true));
    } else {
      this.cartDetails.forEach((c) => (c.checkBox = false));
    }
    this.loadTotalPrice();
    this.checkQuanityAll();
  }
  checkBoxOne(id: number) {
    this.cartDetails
      .filter((c) => c.id === id && c.checkBox != undefined)
      .forEach((c) => (c.checkBox = !c.checkBox));
    this.cartDetails
      .filter((c) => c.id === id && c.checkBox === undefined)
      .forEach((c) => (c.checkBox = true));
    this.loadTotalPrice();
    this.checkQuanityOne(id);
  }
  handleChange(soLuong: number, id: number) {
    if (sessionStorage.getItem("access_token") != null) {
      let check = null;
      this.cartDetails
        .filter(
          (c) =>
            c.id === id &&
            c.quantity <= c.quantityShoesDetail &&
            c.quantity > 0 &&
            c.quantity % 1 === 0
        )
        .forEach(
          (c) =>
            (check = this.cartDetailService
              .editQuanity(soLuong, id)
              .subscribe(() => {
                c.status = 1;
                this.cartDetails
                  .filter((c) => c.checkBox === true)
                  .map((c) => this.loadTotalPrice());
              }))
        );
      if (check === null) {
        this.cartDetailService.getCartDetailById(id).subscribe((Response) => {
          this.cartDetail = Response;
          this.cartDetails
            .filter((response) => response.id === id)
            .map((response) => (response.quantity = this.cartDetail.quantity));
          this.loadTotalPrice();
        });
        this.cartDetails
          .filter((c) => c.id === id && c.quantity > c.quantityShoesDetail)
          .map((c) =>
            this.messageService.add({
              severity: "warn",
              summary: "Thông báo",
              detail:
                "Số lượng đã vượt quá số lượng tồn không thể thay đổi số lượng (số lượng tồn còn lại " +
                c.quantityShoesDetail +
                ")",
              life: 3000,
            })
          );
        this.cartDetails
          .filter(
            (c) => c.id === id && (c.quantity <= 0 || c.quantity % 1 != 0)
          )
          .map((c) =>
            this.messageService.add({
              severity: "warn",
              summary: "Thông báo",
              detail: "Số lượng phải là số nguyên dương",
              life: 3000,
            })
          );
      }
    } else {
      let check = null;
      this.cartDetails
        .filter(
          (c) =>
            c.id === id &&
            c.quantity <= c.quantityShoesDetail &&
            c.quantity > 0 &&
            c.quantity % 1 === 0
        )
        .forEach((c) => (check = c.status = 1));
      if (check != null) {
        this.cartDetails
          .filter((c) => c.checkBox === true)
          .map((c) => this.loadTotalPrice());
        sessionStorage.setItem(
          "cartDetailCustoms",
          JSON.stringify(this.cartDetails)
        );
      } else {
        this.cartDetails
          .filter((c) => c.id === id && c.quantity > c.quantityShoesDetail)
          .map((c) =>
            this.messageService.add({
              severity: "warn",
              summary: "Thông báo",
              detail:
                "Số lượng đã vượt quá số lượng tồn không thể thay đổi số lượng (số lượng tồn còn lại " +
                c.quantityShoesDetail +
                ")",
              life: 3000,
            })
          );
        this.cartDetails
          .filter(
            (c) => c.id === id && (c.quantity <= 0 || c.quantity % 1 != 0)
          )
          .map((c) =>
            this.messageService.add({
              severity: "warn",
              summary: "Thông báo",
              detail: "Số lượng phải là số nguyên dương",
              life: 3000,
            })
          );
        let cartDetailCustoms = sessionStorage.getItem("cartDetailCustoms");
        if (cartDetailCustoms) {
          let datas = JSON.parse(cartDetailCustoms);
          this.cartDetailsChange = datas;
          this.cartDetailsChange
            .filter((c) => c.id === id)
            .map((c) => (this.cartDetailCustom = c));
          this.cartDetails
            .filter((c) => c.id === id)
            .map((c) => (c.quantity = this.cartDetailCustom.quantity));
        }
      }
    }
  }

  loadTotalPrice() {
    this.tongTien = 0;
    this.cartDetails
      .filter((c) => c.checkBox === true)
      .map(
        (c) =>
          (this.tongTien =
            c.discountmethod === 1
              ? this.tongTien + (c.price - c.discountamount_1_2) * c.quantity
              : c.discountmethod === 2
              ? this.tongTien +
                (c.price - (c.price * c.discountamount_1_2) / 100) * c.quantity
              : c.discountmethod === 3
              ? this.tongTien + (c.price - c.discountamount_3_4) * c.quantity
              : c.discountmethod === 4
              ? this.tongTien +
                (c.price - (c.price * c.discountamount_3_4) / 100) * c.quantity
              : this.tongTien + c.price * c.quantity)
      );
  }
  checkQuanityAll() {
    if (sessionStorage.getItem("access_token") != null) {
      let check = null;
      this.cartDetails
        .filter((c) => c.status === 0 && c.quantityShoesDetail != 0)
        .map(
          (c) =>
            (check = this.cartDetailService
              .editQuanity(c.quantityShoesDetail, c.id != undefined ? c.id : -1)
              .subscribe(() => {
                c.quantity = c.quantityShoesDetail;
                c.status = 1;
                this.loadTotalPrice();
              }))
        );
      this.cartDetails
        .filter((c) => c.status === 0 && c.quantityShoesDetail === 0)
        .map(
          (c) =>
            (check = this.cartDetailService
              .deleteCartDetail(c.id != undefined ? c.id : -1)
              .subscribe(() => {
                this.cartDetails = this.cartDetails.filter(
                  (item) => item.id != c.id
                );
                this.loadTotalPrice();
              }))
        );
      if (check != null) {
        this.messageService.add({
          severity: "warn",
          summary: "Thông báo",
          detail:
            "Rất tiếc 1 số sản phẩm Số lượng đã vượt quá số lượng tồn chúng tôi phải điều chỉnh về = số lượng tồn để có thể mua, số lượng tồn = 0 chúng tôi sẽ xóa khỏi giỏ hàng",
          life: 5000,
        });
      }
    } else {
      let check = null;
      this.cartDetails
        .filter((c) => c.status === 0 && c.quantityShoesDetail != 0)
        .map((c) => (check = c.quantity = c.quantityShoesDetail));
      this.cartDetails
        .filter((c) => c.status === 0 && c.quantityShoesDetail != 0)
        .map((c) => (c.status = 1));
      this.cartDetails
        .filter((c) => c.status === 0 && c.quantityShoesDetail === 0)
        .map(
          (c) =>
            (this.cartDetails = this.cartDetails.filter(
              (item) => (check = item.id != c.id)
            ))
        );
      if (check != null) {
        sessionStorage.setItem(
          "cartDetailCustoms",
          JSON.stringify(this.cartDetails)
        );
        this.loadTotalPrice();
        this.messageService.add({
          severity: "warn",
          summary: "Thông báo",
          detail:
            "Rất tiếc 1 số sản phẩm Số lượng đã vượt quá số lượng tồn chúng tôi phải điều chỉnh về = số lượng tồn để có thể mua, số lượng tồn = 0 chúng tôi sẽ xóa khỏi giỏ hàng",
          life: 5000,
        });
      }
    }
  }
  checkQuanityOne(id: number) {
    if (sessionStorage.getItem("access_token") != null) {
      this.cartDetails
        .filter(
          (c) => c.status === 0 && c.quantityShoesDetail != 0 && c.id === id
        )
        .map((c) =>
          this.cartDetailService
            .editQuanity(c.quantityShoesDetail, id)
            .subscribe(() => {
              c.quantity = c.quantityShoesDetail;
              c.status = 1;
              this.loadTotalPrice();
              this.messageService.add({
                severity: "warn",
                summary: "Thông báo",
                detail:
                  "Rất tiếc sản phẩm Số lượng đã vượt quá số lượng tồn chúng tôi phải điều chỉnh về = số lượng tồn để có thể mua",
                life: 5000,
              });
            })
        );
      this.cartDetails
        .filter(
          (c) => c.status === 0 && c.quantityShoesDetail === 0 && c.id === id
        )
        .map((c) =>
          this.cartDetailService.deleteCartDetail(id).subscribe(() => {
            this.cartDetails = this.cartDetails.filter(
              (item) => item.id != c.id
            );
            this.loadTotalPrice();
            this.messageService.add({
              severity: "warn",
              summary: "Thông báo",
              detail:
                "Rất tiếc sản phẩm đã hết hàng để có thể mua sản phẩm khác chúng tôi sẽ xóa bỏ sản phẩm khỏi giỏ hàng",
              life: 5000,
            });
          })
        );
    } else {
      let check = null;
      let checkDelete = null;
      this.cartDetails
        .filter(
          (c) => c.status === 0 && c.quantityShoesDetail != 0 && c.id === id
        )
        .map((c) => (check = c.quantity = c.quantityShoesDetail));
      this.cartDetails
        .filter(
          (c) => c.status === 0 && c.quantityShoesDetail != 0 && c.id === id
        )
        .map((c) => (c.status = 1));
      if (check != null) {
        sessionStorage.setItem(
          "cartDetailCustoms",
          JSON.stringify(this.cartDetails)
        );
        this.messageService.add({
          severity: "warn",
          summary: "Thông báo",
          detail:
            "Rất tiếc sản phẩm Số lượng đã vượt quá số lượng tồn chúng tôi phải điều chỉnh về = số lượng tồn để có thể mua",
          life: 5000,
        });
      }
      this.cartDetails
        .filter(
          (c) => c.status === 0 && c.quantityShoesDetail === 0 && c.id === id
        )
        .map(
          (c) =>
            (this.cartDetails = this.cartDetails.filter(
              (item) => (checkDelete = item.id != c.id)
            ))
        );
      if (checkDelete != null) {
        sessionStorage.setItem(
          "cartDetailCustoms",
          JSON.stringify(this.cartDetails)
        );
        this.messageService.add({
          severity: "warn",
          summary: "Thông báo",
          detail:
            "Rất tiếc sản phẩm đã hết hàng để có thể mua sản phẩm khác chúng tôi sẽ xóa bỏ sản phẩm khỏi giỏ hàng",
          life: 5000,
        });
      }
      this.loadTotalPrice();
    }
  }
  pay() {
    if (sessionStorage.getItem("shoesDetailInOder") != null) {
      sessionStorage.removeItem("shoesDetailInOder");
    }
    let checkPay = false;
    this.cartDetails
      .filter((c) => c.checkBox === true)
      .map((c) => (checkPay = true));
    if (checkPay === false) {
      this.messageService.add({
        severity: "warn",
        summary: "Thông báo",
        detail: "Bạn vẫn chưa chọn sản phẩm nào để mua hàng",
        life: 5000,
      });
    } else {
      this.cartDetails
        .filter((c) => c.checkBox === true)
        .map((c) => this.cartDetailCustoms.push(c));
      this.cartDetailCustoms.map(
        (c) =>
          (c.priceDiscount =
            c.discountmethod === 1
              ? c.price - c.discountamount_1_2
              : c.discountmethod === 2
              ? c.price - (c.price * c.discountamount_1_2) / 100
              : c.discountmethod === 3
              ? c.price - c.discountamount_3_4
              : c.discountmethod === 4
              ? c.price - (c.price * c.discountamount_3_4) / 100
              : c.price)
      );
      this.cartDetailCustomerService.setCartDetailCustomerService(
        this.cartDetailCustoms
      );
      sessionStorage.setItem(
        "shoesDetailInOder",
        JSON.stringify(this.cartDetailCustoms)
      );
      this.router.navigate(["/client/pay"]);
    }
  }
  shoesDetail(shoesDetail: CartDetailCustom) {
    const queryParams = {
      shid: shoesDetail.idsh,
      brid: shoesDetail.idb,
      siid: shoesDetail.idsz,
      clid: shoesDetail.idc,
    };

    this.router.navigate(["/client/shoes-detail"], {
      queryParams: queryParams,
    });
  }
}
