import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

export interface ShoesDetail {
  id?: number;
  code: string;
  price: number;
  quantity: number;
  images: string[];
  description: string;
  shoes: {
    id: number;
    name: string;
  };
  brand: {
    id: number;
    name: string;
  };
  color: {
    id: number;
    name: string;
  }[]
  size: {
    id: number;
    name: string;
  }[]
}

@Component({
  selector: 'app-shoes-inspect',
  templateUrl: './shoes-inspect.component.html',
  styleUrls: ['./shoes-inspect.component.css']
})
export class ShoesInspectComponent {
  sizeOptions: any[] = [{ name: "31", value: 1 }, { name: "32", value: 2 }, { name: "33", value: 3 }, { name: "34", value: 4 }];
  selectedsize: any = null;
  colorOptions: any[] = [{ name: "31", value: 1 }, { name: "32", value: 2 }, { name: "33", value: 3 }, { name: "34", value: 4 }];
  selectedColor: any = null;
  quantity: number = 1
  visible: boolean = false;
  activeIndex: number = 0;
  shoesDetails: ShoesDetail;
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.shoesDetails = {
      code: "ABC123",
      price: 50000,
      quantity: 100,
      images: [
        "https://duyhung-bucket.s3.ap-southeast-1.amazonaws.com/images/badcb1487af6c62c6a0cb1487af6c62c6a0Screenshot2023-07-26163607.png",
        "https://tse3.mm.bing.net/th/id/OIP.AjzWApytAwaFTtBLVhLPdwHaHa?w=217&h=217&c=7&r=0&o=5&dpr=1.1&pid=1.7",
        "https://tse3.mm.bing.net/th/id/OIP.AjzWApytAwaFTtBLVhLPdwHaHa?w=217&h=217&c=7&r=0&o=5&dpr=1.1&pid=1.7",
        "https://tse3.mm.bing.net/th/id/OIP.AjzWApytAwaFTtBLVhLPdwHaHa?w=217&h=217&c=7&r=0&o=5&dpr=1.1&pid=1.7",
        "https://tse3.mm.bing.net/th/id/OIP.AjzWApytAwaFTtBLVhLPdwHaHa?w=217&h=217&c=7&r=0&o=5&dpr=1.1&pid=1.7"
      ],
      description: "Giày được thiết kế dáng thắt dây năng động,mặt giày sử dụng chất liệu da tổng hợp phối màu,in chữ thời trang Đặc biệt sản phẩm sử dụng chất liệu da cao cấp có độ bền tối ưu giúp bạn thoải mái trong mọi hoàn cảnh.Giày thoáng khí cả mặt trong lẫn mặt ngoài khiến người mang luôn cảm thấy dễ chịu dù hoạt động trong thời gian dài.",
      shoes: {
        id: 1,
        name: "Running Shoes",
      },
      brand: {
        id: 2,
        name: "Nike",
      },
      color: [
        {
          id: 1,
          name: "Red",
        },
        {
          id: 2,
          name: "Blue",
        },
      ],
      size: [
        {
          id: 1,
          name: "US 9",
        },
        {
          id: 2,
          name: "US 10",
        },
      ],
    };

  }
  showGuide() {
    this.visible = true;
  }
}
