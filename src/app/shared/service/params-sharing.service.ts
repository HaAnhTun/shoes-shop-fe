import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConstants } from 'src/app/app-constants';
  /**
   * Service chia sẻ dữ params giữa các component.
   * @author vunbl
   */
@Injectable({
  providedIn: 'root'
})
/**
 * Dịch vụ chia sẻ tham số lưu trữ.
 * Được sử dụng để lưu trữ và chia sẻ các tham số giữa các component.
 */
export class ParamsSharingService {
  /**
   * BehaviorSubject để chia sẻ dữ liệu tham số đã lưu trữ.
   * Giá trị ban đầu là một đối tượng có các trường như sau:
   * - sortParams: Một Map chứa các tham số sắp xếp với các giá trị mặc định.
   * - name: Tên nhân viên.
   * - department: Phòng ban.
   * - currentPage: Trang hiện tại.
   */
  public storedParamsSubject: BehaviorSubject<any> = new BehaviorSubject<any>({
    sortParams: new Map<string, string>([            
      [AppConstants.EMPLOYEE_NAME_ORDER, AppConstants.SORT_ASC],
      [AppConstants.CERTIFICATION_NAME_ORDER, AppConstants.SORT_ASC],
      [AppConstants.END_DATE_ORDER, AppConstants.SORT_ASC]
    ]),
    name: '',
    department: '',
    currentPage: ''
  });

  constructor() { }

  /**
   * Lưu trữ các tham số vào BehaviorSubject để chia sẻ.
   * @param params Các tham số cần lưu trữ.
   */
  saveParams(params: any) {
    this.storedParamsSubject.next(params);
  }
}
