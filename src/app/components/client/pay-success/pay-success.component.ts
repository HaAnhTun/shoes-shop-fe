import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-pay-success",
  templateUrl: "./pay-success.component.html",
  styleUrls: ["./pay-success.component.css"],
})
export class PaySuccessComponent implements OnInit {
  ngOnInit(): void {
    if (sessionStorage.getItem("access_token") == null) {
      const shoesInCart = sessionStorage.getItem("shoesInCart");
      let cartDetailCustoms = sessionStorage.getItem("cartDetailCustoms");
      if (cartDetailCustoms && shoesInCart) {
        // Chuyển đổi chuỗi shoesInCart thành một mảng
        const shoesArray = JSON.parse(shoesInCart);
    
        // Kiểm tra xem cartDetailCustoms có giá trị không phải null
        if (cartDetailCustoms !== null) {
            // Chuyển đổi chuỗi cartDetailCustoms thành một mảng
            let parsedCartDetailCustoms = JSON.parse(cartDetailCustoms);
    
            // Kiểm tra xem parsedCartDetailCustoms có giá trị không phải null
            if (parsedCartDetailCustoms !== null) {
              console.log(parsedCartDetailCustoms)
                // Lặp qua từng phần tử trong shoesArray
                shoesArray.forEach((shoe: any) => {
                  console.log(shoe)
                    // Lọc và xóa các phần tử trong parsedCartDetailCustoms nếu chúng xuất hiện trong shoesArray
                    parsedCartDetailCustoms = parsedCartDetailCustoms.filter((cartItem: any) => cartItem.id !== shoe);
                });
    
                console.log(parsedCartDetailCustoms)
                // Lưu mảng đã cập nhật vào sessionStorage
                sessionStorage.setItem("cartDetailCustoms", JSON.stringify(parsedCartDetailCustoms));
            }
        }
    }
    }
  }
}
