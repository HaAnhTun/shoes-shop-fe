// Import các module và service cần thiết
import { Component } from '@angular/core';
import { ErrorDataService } from '../../service/error-data.service';
import { ErrorResponse } from 'src/app/model/ErrorrResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-system-error',
  templateUrl: './system-error.component.html',
})
export class SystemErrorComponent {
  errorResponse?: ErrorResponse;

  constructor(private errorDataService: ErrorDataService, private router: Router) {
    // Đăng ký callback để lắng nghe dữ liệu lỗi từ service
    this.errorDataService.errorData.subscribe(data => { this.errorResponse = data });
    console.log(this.errorResponse);

  }

  /**
   * Xác nhận xử lý lỗi và chuyển hướng về trang danh sách người dùng.
   */
  confirmError() {
    // Xóa dữ liệu lỗi trong service
    this.errorDataService.clearData();
    // Chuyển hướng về trang danh sách người dùng
    this.router.navigate(['user/list']);
  }
}
