import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Discount } from "src/app/model/DiscountShoesDetails";
import { Product } from "src/app/model/Product";
import { ProductService } from "src/app/product.service";
import { DiscountService } from "src/app/service/discount.service";

@Component({
  selector: "app-discount-add",
  templateUrl: "./discount-add.component.html",
  styleUrls: ["./discount-add.component.css"],
})
export class DiscountAddComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private discountService: DiscountService,
    private route: ActivatedRoute
  ) {}
  idDiscount: number | null;
  shoesDetailsDialog: boolean = false;
  shoesDetails: Product[];
  shoesDetails2: Product[];
  selectedShoes: Product[] = new Array();
  discount: Discount;
  product: Product | null;
  discountMethods: Object[];
  formDiscount = this.fb.group({
    id: [""],
    code: [""],
    name: [""],
    discountMethod: [""],
    discountAmount: [""],
    discountStatus: [""],
    startDate: [""],
    endDate: [""],
    discountShoesDetailsDTOS: this.fb.array([]),
  });
  ngOnInit(): void {
    this.productService.getProducts().subscribe((response) => {
      console.log(response);
      this.shoesDetails = response;
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.idDiscount = Number(params.get("id"));
    });
    if (this.idDiscount != null) {
      this.discountService.getDiscount(this.idDiscount).subscribe((res) => {
        this.formDiscount.get("id")?.setValue(res.id);
        this.formDiscount.get("code")?.setValue(res.code);
        this.formDiscount.get("name")?.setValue(res.name);
        this.formDiscount.get("discountMethod")?.setValue(res.discountMethod);
        this.formDiscount.get("discountAmount")?.setValue(res.discountAmount);
        this.formDiscount.get("discountStatus")?.setValue(res.discountStatus);
        this.formDiscount
          .get("startDate")
          ?.setValue(new Date(res.startDate).toISOString().split("T")[0]);
        this.formDiscount
          .get("endDate")
          ?.setValue(new Date(res.endDate).toISOString().split("T")[0]);
        for (let p of res.discountShoesDetailsDTOS) {
          console.log(p);
          this.selectedShoes.push(p.shoesDetails);
        }
        this.pushShoes();
      });
    }
    this.discountMethods = [
      { id: 1, name: "abc" },
      { id: 2, name: "xyz" },
      { id: 3, name: "sss" },
      { id: 4, name: "ddd" },
    ];
  }
  openShoesDetailsDialog() {
    this.shoesDetailsDialog = true;
  }
  get discountShoesDetailsDTOS() {
    return this.formDiscount.get("discountShoesDetailsDTOS") as FormArray;
  }
  initDetails(product: Product) {
    return this.fb.group({
      id: [""],
      shoesDetails: [{ id: product.id }],
      code: [product.code],
      name: [product.name],
      brand: [product.brand],
      discountAmount: [""],
      status: [""],
    });
  }
  pushShoes() {
    for (let p of this.selectedShoes) {
      this.discountShoesDetailsDTOS.push(this.initDetails(p));
    }
    this.shoesDetails = this.shoesDetails.filter(
      (shoes) => !this.selectedShoes.includes(shoes)
    );
    console.log(this.formDiscount.value);
  }
  deleteShoes(index: number) {
    this.discountShoesDetailsDTOS.removeAt(index);
  }
  saveFormDiscount() {
    this.discountService.saveDiscount(this.formDiscount.value).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
