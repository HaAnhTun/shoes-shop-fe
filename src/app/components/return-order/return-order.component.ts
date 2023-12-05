import { HttpClient } from "@angular/common/http";
import { Component, NgModule, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";

@Component({
  selector: "app-return-order",
  templateUrl: "./return-order.component.html",
  styleUrls: ["./return-order.component.css"],
})
export class ReturnOrderComponent implements OnInit {
  order: any;
  orderId: any = -1;
  enable: boolean[] = [];
  selectedOrderDetails: any[] = [];
  returnMethods: any[];
  shoesDetails: any[];
  selectedCountry: any;
  filteredCountries: any[] | undefined;
  disabledRows: Set<number> = new Set<number>();
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get("id"));
    this.http
      .get("http://localhost:8088/api/orders/" + this.orderId)
      .subscribe((res) => {
        this.order = res;
        console.log(this.order);
        for (let data of this.order.orderDetailsDTOList) {
          let orderdetail = this.initReturnOrderDetails(data);
          // let returnShoesDetails = orderdetail.get(
          //   "returnShoesDetails"
          // ) as FormArray;
          // returnShoesDetails.push(this.initReturnShoesDetails());
          this.returnOrderDetails.push(orderdetail);
          this.enable.push(false);
        }
      });
    this.fetchProducts();
   this.datas = this.fb.group({
      orderId: [this.orderId],
      returnOrderDetails: this.fb.array<FormArray>([]),
    });
    this.returnMethods = [
      {
        code: 1,
        name: "Đổi hàng",
      },
      {
        code: 2,
        name: "Trả hàng",
      },
    ];
  }
  datas : FormGroup;
  get returnOrderDetails() {
    return this.datas.get("returnOrderDetails") as FormArray;
  }
  shoesReturnDetails(index: number) {
    return (this.returnOrderDetails.at(index) as FormGroup).get(
      "returnShoesDetails"
    ) as FormArray;
  }
  get orderDetails() {
    return this.order.orderDetailsDTOList as any[];
  }
  pushOrderDetails(data: { id: any }) {
    this.returnOrderDetails.push(this.initReturnOrderDetails(data));
  }
  initReturnOrderDetails(data: { id: any }) {
    return this.fb.group({
      orderDetailsId: [data.id],
      returnQuantity: [""],
      reason: [""],
      type: [""],
      returnShoesDetails: this.fb.array<FormArray>([]),
    });
  }
  initReturnShoesDetails() {
    return this.fb.group({
      shoesDetailsId: [""],
      quantity: [""],
      price: [""],
      discount: [""],
    });
  }
  isRowDisabled(rowIndex: number): boolean {
    return this.disabledRows.has(rowIndex);
  }

  onCheckboxChange(rowData: any, rowIndex: number): void {
    if (rowData.isChecked) {
      this.disabledRows.add(rowIndex);
    } else {
      this.disabledRows.delete(rowIndex);
    }
  }
  filterCountry(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.shoesDetails as any[]).length; i++) {
      let country = (this.shoesDetails as any[])[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    this.filteredCountries = filtered;
  }
  fetchProducts() {
    this.http
      .get<any>("http://localhost:8088/api/shoes-details/shop")
      .subscribe(
        (data) => {
          this.shoesDetails = data;
          console.log(data);
        },
        (error) => {
          console.error("Error fetching products:", error);
        }
      );
  }
  addShoesDetails(index: number) {
    console.log(index);
    this.shoesReturnDetails(index).push(this.initReturnShoesDetails());
  }
  selectedMethod(data: number, index: number) {
    if (data == 1) {
      this.enable[index] = true;
      (
        (this.returnOrderDetails.at(index) as FormGroup).get(
          "returnShoesDetails"
        ) as FormArray
      ).push(this.initReturnShoesDetails());
    } else {
      this.enable[index] = true;
      (
        (this.returnOrderDetails.at(index) as FormGroup).get(
          "returnShoesDetails"
        ) as FormArray
      ).clear();
    }
  }
  submitOrder(){
    if(this.selectedOrderDetails){
      this.returnOrderDetails.controls = this.returnOrderDetails.controls.filter((data1) => {
        return this.selectedOrderDetails.find((data) => {
           return data1.get("orderDetailsId")?.value == data.get("orderDetailsId")?.value
        }) 
     })
      this.returnOrderDetails.controls.forEach(element => {
        if(element.get("returnShoesDetails") != null && (element.get("returnShoesDetails") as FormArray).controls.length> 0 ){
          (element.get("returnShoesDetails") as FormArray).controls.forEach((elemen1) => {
            if(!(elemen1.get("shoesDetailsId")?.value instanceof Number)){
              let object = elemen1.get("shoesDetailsId")?.value;
              elemen1.get("shoesDetailsId")?.setValue(object.id);
              elemen1.get("price")?.setValue(object.price);
              elemen1.get("discount")?.setValue(object.discount_amount);
            }
            
          })
        }
      });
      this.http.post("http://localhost:8088/api/order-returns",this.datas.value).subscribe(
        (res) => {
          console.log(res)
        }
      )
    }
  }
}
