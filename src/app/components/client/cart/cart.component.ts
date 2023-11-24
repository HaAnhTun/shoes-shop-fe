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

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
  providers: [ConfirmationService, MessageService],
})
export class CartComponent implements OnInit {
  // cartDetails: CartDetail[];
  cartDetails: CartDetailCustom[];
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
    // this.cartDetailService.getAllCartDetail().subscribe((Response) => {
    //   this.cartDetails = Response;
    //   this.cartDetails
    //     .filter((c) => c.quantity > c.shoesDetails.quantity)
    //     .forEach((c) => (c.status = 0));
    // });
    this.cartDetailService.getAllCartDetailPath().subscribe((Response) => {
      this.cartDetails = Response;
      this.cartDetails
        .filter((c) => c.quantity > c.quantityShoesDetail)
        .forEach((c) => (c.status = 0));
    });
  }
  addQuanity(id: number) {
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
  }
  reduceQuantity(id: number) {
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
  }
  deleteProductCart(id: number) {
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
              this.cartDetails
                .filter((c) => c.checkBox === true)
                .map((c) => this.loadTotalPrice());
            }))
      );
    this.cartDetails
      .filter(
        (c) =>
          c.id === id &&
          c.quantity <= c.quantityShoesDetail &&
          c.quantity > 0 &&
          c.quantity % 1 === 0 &&
          c.status === 0
      )
      .map((c) => (c.status = 1));
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
            detail: "Số lượng đã vượt quá số lượng tồn không thể thêm số lượng",
            life: 3000,
          })
        );
      this.cartDetails
        .filter((c) => c.id === id && (c.quantity <= 0 || c.quantity % 1 != 0))
        .map((c) =>
          this.messageService.add({
            severity: "warn",
            summary: "Thông báo",
            detail: "Số lượng phải là số nguyên dương",
            life: 3000,
          })
        );
    }
  }

  loadTotalPrice() {
    this.tongTien = 0;
    this.cartDetails
      .filter((c) => c.checkBox === true)
      .map((c) => (this.tongTien = this.tongTien + c.price * c.quantity));
  }
  checkQuanityAll() {
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
  }
  checkQuanityOne(id: number) {
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
          this.cartDetails = this.cartDetails.filter((item) => item.id != c.id);
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
  }
  pay() {
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
      this.cartDetailCustomerService.setCartDetailCustomerService(
        this.cartDetailCustoms
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
