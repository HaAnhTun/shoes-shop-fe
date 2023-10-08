import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service chia sẻ dữ liệu nhân viên giữa các component.
 * @author vunbl
 */
@Injectable({
  providedIn: 'root'

})

export class DataSharingService {
  /**
   * BehaviorSubject để chia sẻ dữ liệu nhân viên giữa các component.
   * Giá trị ban đầu là một đối tượng nhân viên rỗng có các trường Date là ngày hiện tại.
   */

  public shareableData: BehaviorSubject<any> = new BehaviorSubject<any>({
    employee: {
      employeeName: '',
      departmentId: '',
      employeeNameKana: '',
      employeeBirthDate: '',
      employeeEmail: '',
      employeeTelephone: '',
      employeeLoginId: '',
      rePassword: '',
      employeeLoginPassword: '',
      certificationEmployee: {
        certificationId: '',
        certificationStartDate: '',
        certificationEndDate: '',
        employeeCertificationScore: ''
      }
    },
    departmentName: '',
    certificateName: '',
  });

  constructor() { }

  /**
   * Cập nhật dữ liệu chia sẻ với nội dung mới.
   * @param newContent Nội dung mới cần chia sẻ.
   */
  public updateData(newContent: any): void {
    this.shareableData.next(newContent);
  }

  /**
  * Reset data về mạc định
  */
  public clearData(): void {
    this.shareableData.next({
      employee: {
        employeeName: '',
        departmentId: '',
        employeeNameKana: '',
        employeeBirthDate: '',
        employeeEmail: '',
        employeeTelephone: '',
        employeeLoginId: '',
        rePassword: '',
        employeeLoginPassword: '',
        certificationEmployee: {
          certificationId: '',
          certificationStartDate: '',
          certificationEndDate: '',
          employeeCertificationScore: ''
        }
      },
      departmentName: '',
      certificateName: '',
    })
  }
}
