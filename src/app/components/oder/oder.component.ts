import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Order } from "src/app/model/Order";
import { OrderService } from "src/app/service/order.service";
import { OrderSearchReq } from "src/app/model/OrderSearchReq";
import { AddressService } from "src/app/service/address.service";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import {
  ConfirmEventType,
  ConfirmationService,
  MessageService,
} from "primeng/api";
import { Product } from "src/app/model/Product";
import { ShoesDetail } from "../shoes-detail-add/shoes-detail-add.component";
import { OrderDetals } from "src/app/model/OrderDetails";
import { ProductService } from "src/app/product.service";
import { SizeData } from "src/app/model/Size";
import { AppConstants } from "src/app/app-constants";
@Component({
  selector: "app-oder",
  templateUrl: "./oder.component.html",
  styleUrls: ["./oder.component.css"],
})
export class OderComponent implements OnInit {
  listMenuItems: any[] = [];
  listOder: any[] = [];
  listPayment: any[] = [];
  indexOder: number = 0;
  check: boolean = false;
  checkOne: boolean = false;
  checkOder: boolean = false;
  checkIndexOder: number = 0;
  checkString: String = "";
  orderQuantity: Map<any, any>;
  orders: Order[] = [];
  orderSearchReqDTO: OrderSearchReq = {
    status: 0,
  };
  chartData: any[] | undefined;
  cities: any[];
  selectedCity: any;
  districts: any[];
  selectedDistricts: any;
  wards: any[];
  shoesDetails: Product[];
  orderDetailsDialog: boolean = false;
  selectedShoes: any[];
  uploadedFiles: any[] = [];
  selectedSize: any[] = [];
  selectedColor: any[] = [];
  shoeVariants: ShoesDetail[];
  shoesVariantsList: any[];
  orderDetails: OrderDetals = {
    shoesDetails: {
      shoes: { id: 0, name: "" },
      status: 1,
      quantity: 0,
      brand: { id: 0, name: "" },
      description: "",
      import_price: 0,
      price: 0,
      tax: 0,
      code: "",
      color: { id: 0, name: "" },
      size: { id: 0, name: "" },
      images: [...this.uploadedFiles],
    },
  };
  constructor(
    private orderService: OrderService,
    private addressService: AddressService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private productService: ProductService,
    private http: HttpClient
  ) {}
  formOrder = this.fb.array<FormArray>([]);
  initForm() {
    return this.fb.group({
      id: [""],
      code: [{ value: "", disabled: true }, Validators.required],
      receivedBy: ["", Validators.required],
      phone: ["", Validators.required],
      userAddress: this.fb.group({
        province: [""],
        district: [""],
        ward: [""],
        addressDetails: [""],
      }),
      paymentMethod: [""],
      paymentStatus: [""],
      totalPrice: [""],
      status: [""],
      orderDetailsDTOList: this.fb.array<FormArray>([]),
    });
  }
  ngOnInit() {
    this.fetchCities();
    this.fetchQuantityOrder();
    this.fetchOrders();
    this.productService.getProducts().subscribe((response) => {
      this.shoesDetails = response;
      console.log(this.shoesDetails);
    });
    this.check = true;
    this.checkString = "Chờ xác nhận";
    this.listMenuItems = [
      { code: 0, name: "Chờ xác nhận", quantity: 0 },
      { code: 1, name: "Chờ giao", quantity: 0 },
      { code: 2, name: "Đang giao", quantity: 0 },
      { code: 3, name: "Hoàn thành", quantity: 0 },
      { code: -1, name: "Hủy", quantity: 0 },
      { code: 4, name: "Chờ thanh toán", quantity: 0 },
    ];
    this.listPayment = [
      { code: 0, name: "Tiền mặt" },
      { code: 1, name: "Chuyển khoản" },
    ];
  }
  get getFormOrder() {
    return this.formOrder as FormArray;
  }
  creatOder() {
    this.getFormOrder.push(this.initForm());
    this.checkOder = true;
    if (this.listOder.length >= 5) {
      return;
    }
    this.indexOder++;
    this.listOder.push(this.indexOder);
  }
  updateSize(shoesDetails: any) {
    console.log(shoesDetails);
  }
  clickIndexOder(index: number): void {
    this.checkIndexOder = index;
  }
  clickListOder(label: String) {
    if (label.startsWith("Chờ xác nhận")) {
      this.checkString = "Chờ xác nhận";
      this.orderSearchReqDTO.status = 0;
      this.check = true;
      this.checkOne = false;
    } else if (label.startsWith("Chờ giao")) {
      this.checkString = "Chờ giao";
      this.orderSearchReqDTO.status = 1;
      this.check = true;
      this.checkOne = false;
    } else if (label.startsWith("Đang giao")) {
      this.checkString = "Đang giao";
      this.orderSearchReqDTO.status = 2;
      this.check = true;
      this.checkOne = false;
    } else if (label.startsWith("Hoàn thành")) {
      this.checkString = "Hoàn thành";
      this.orderSearchReqDTO.status = 3;
      this.checkOne = true;
      this.check = false;
    } else if (label.startsWith("Hủy")) {
      this.checkString = "Hủy";
      this.orderSearchReqDTO.status = -1;
      this.checkOne = true;
      this.check = false;
    } else if (label.startsWith("Chờ thanh toán")) {
      this.checkString = "Chờ thanh toán";
      this.orderSearchReqDTO.status = 4;
      this.check = true;
      this.checkOne = false;
    }
    this.fetchOrders();
  }
  fetchOrders(): void {
    this.orderService.getOrders(this.orderSearchReqDTO).subscribe(
      (res) => {
        this.orders = res;
      },
      (error) => {}
    );
  }
  fetchQuantityOrder(): void {
    this.orderService.getOrderQuantity().subscribe((res) => {
      this.orderQuantity = new Map(Object.entries(res));
      for (let i = 0; i < this.listMenuItems.length; i++) {
        if (this.orderQuantity.has(this.listMenuItems[i].code + ""))
          this.listMenuItems[i].quantity = this.orderQuantity.get(
            this.listMenuItems[i].code + ""
          );
      }
    });
  }
  fetchCities() {
    this.addressService.getProvines().subscribe(
      (res) => {
        this.cities = res;
      },
      (error) => {}
    );
  }
  fetchDistricts() {
    this.addressService
      .getDistrict(
        Number(
          this.formOrder.get(this.checkIndexOder - 1 + "")?.value.userAddress
            .province
        )
      )
      .subscribe(
        (res) => {
          this.districts = res.districts;
        },
        (error) => {}
      );
  }
  fetchWards() {
    this.addressService
      .getWards(
        Number(
          this.formOrder.get(this.checkIndexOder - 1 + "")?.value.userAddress
            .district
        )
      )
      .subscribe(
        (res) => {
          this.wards = res.wards;
        },
        (error) => {}
      );
  }
  initDetails(data: OrderDetals) {
    return this.fb.group({
      id: [data ? data.id : ""],
      shoesDetails: [
        {
          id: data.shoesDetails.id,
          name:
            data.shoesDetails.shoes.name +
            "[ " +
            data.shoesDetails.color.name +
            " - " +
            data.shoesDetails.size.name +
            " ]",
        },
      ],
      price: [data.shoesDetails.price],
      code: [data.shoesDetails.code],
      brand: [data.shoesDetails.brand.name],
      quantity: [data.quantity ? data.quantity : 1],
      status: [data.status ? data.status : 1],
    });
  }
  get orderDetailsDTOList() {
    return this.formOrder
      .get(this.checkIndexOder - 1 + "")
      ?.get("orderDetailsDTOList") as FormArray;
  }
  pushShoesDetails() {
    for (let p of this.selectedShoes) {
      if (p.selectedShoesDetails)
        for (let p1 of p.selectedShoesDetails) {
          this.orderDetails.shoesDetails = p1;
          if (
            !this.orderDetailsDTOList.value.find(
              (o: { shoesDetails: { id: any }; status: any }) =>
                o.shoesDetails.id === p1.id && o.status !== -1
            )
          ) {
            this.orderDetailsDTOList.push(this.initDetails(this.orderDetails));
          }
        }
    }
    this.updateTotalPrice();
    this.closeShoesDetailsDialog();
  }
  openShoesDetailsDialog() {
    this.selectedShoes = [];
    this.orderDetailsDialog = true;
  }
  saveOrder() {
    let data = this.formOrder.at(this.checkIndexOder - 1);
    this.confirmationService.confirm({
      message: "Bạn muốn lưu thông tin hóa đơn?",
      header: "Lưu hóa đơn",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.orderService.saveOrder(data.value).subscribe((res) => {
          this.messageService.add({
            severity: "success",
            summary: "Thêm mới thành công",
            life: 3000,
          });
        });
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: "error",
              summary: "Rejected",
              detail: "You have rejected",
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
  closeShoesDetailsDialog() {
    this.orderDetailsDialog = false;
  }
  visible: boolean = false;
  updateVisibility(): void {
    this.visible = false;
    setTimeout(() => (this.visible = true), 0);
  }
  updateSelectedShoesSize(id: number, colorId: number, size: any[]) {
    let arr = new Array<ShoesDetail>();
    let shoesOrigin = this.shoesDetails.find((s) => s.id === id);
    let shoes = this.selectedShoes.find(
      (s) => s.shoes.id === id && s.color.id === colorId
    );
    let index = this.selectedShoes.indexOf(shoes);
    console.log(index, "index");
    let shoesDetails = shoesOrigin ? shoesOrigin.shoesDetails : undefined;
    console.log(shoesDetails, "shoesDetails");
    for (let z of size) {
      let shoesDetailsSelected = shoesDetails
        ? shoesDetails.find(
            (s: {
              shoes: { id: number };
              size: { id: any };
              color: { id: any };
            }) => {
              return (
                s.shoes.id === id && s.size.id === z && s.color.id === colorId
              );
            }
          )
        : undefined;
      arr.push(
        shoesDetailsSelected
          ? shoesDetailsSelected
          : {
              shoes: { id: 0, name: "" },
              status: -1,
              quantity: 0,
              brand: { id: 0, name: "" },
              description: "",
              import_price: 0,
              price: 0,
              tax: 0,
              code: "",
              color: { id: 0, name: "" },
              size: { id: 0, name: "" },
              images: [...this.uploadedFiles],
            }
      );
    }
    if (shoes) {
      console.log(shoes, "shoes");
      console.log(arr, "arr");
      this.selectedShoes[index].selectedShoesDetails = arr;
    }
    console.log(arr, "s");
    console.log(this.selectedShoes, "selected");
  }
  deleteShoesDetails(index: number) {
    this.orderDetailsDTOList.at(index).get("status")?.setValue(-1);
  }
  generateShoeVariants(): ShoesDetail[] {
    this.http
      .get<any>(AppConstants.BASE_URL_API + "/api/shoes-details")
      .subscribe((response: any[]) => {
        this.shoesVariantsList = response;
      });
    const variants: ShoesDetail[] = [];
    for (const shoes of this.selectedShoes) {
      for (const color of shoes.colorDTOs) {
        for (const size of shoes.sizeDTOs) {
          const brand = shoes.shoesDetails;
          const variant: ShoesDetail = {
            shoes: { id: shoes.id, name: shoes.name },
            status: shoes.status,
            quantity: 0,
            brand: { id: brand.id, name: brand.name },
            description: "",
            import_price: 0,
            price: 0,
            tax: 0,
            code: shoes.code + brand.code + color.code + size.code,
            color: { id: color.id, name: color.name },
            size: { id: size.id, name: size.name },
            images: [...this.uploadedFiles],
          };
          let isCodeFound = this.shoesVariantsList.some(
            (v) => v.code == variant.code
          );
          if (isCodeFound) {
            this.messageService.add({
              severity: "warning",
              summary: "Exist",
              detail:
                "Variants " +
                variant.shoes.name +
                "-" +
                variant.brand.name +
                "[" +
                variant.color.name +
                "-" +
                variant.size.name +
                "]" +
                " Existed",
              life: 3000,
            });
          } else {
            variants.push(variant);
            this.messageService.add({
              severity: "success",
              summary: "Generate",
              detail:
                "Variants " +
                variant.shoes.name +
                "-" +
                variant.brand.name +
                "[" +
                variant.color.name +
                "-" +
                variant.size.name +
                "]" +
                " Generated",
              life: 3000,
            });
          }
        }
      }
    }

    return variants;
  }
  updateTotalPrice() {
    let data = this.formOrder.at(this.checkIndexOder - 1);
    let orderDetailList = this.orderDetailsDTOList.value;
    let totalPrice = 0;
    for (let od of orderDetailList) {
      totalPrice += od.price * od.quantity;
    }
    data.get("totalPrice")?.setValue(totalPrice);
  }
  // this.hideShoesDetailsDialog();
  // calculateCategoryCounts(orders: Order[]): any {
  //   const categoryCounts: { [category: string]: number } = {};
  //   for (const product of orders) {
  //     for (const category of product.categories) {
  //       const categoryName = category.name;
  //       if (categoryCounts[categoryName]) {
  //         categoryCounts[categoryName] += 1;
  //       } else {
  //         categoryCounts[categoryName] = 1;
  //       }
  //     }
  //   }

  //   const chartData = {
  //     labels: Object.keys(categoryCounts),
  //     datasets: [
  //       {
  //         label: "Category Counts",
  //         backgroundColor: "#42A5F5",
  //         data: Object.values(categoryCounts),
  //       },
  //     ],
  //   };

  //   return chartData;
  // }
}
