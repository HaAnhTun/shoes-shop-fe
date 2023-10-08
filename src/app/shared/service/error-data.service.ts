import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ErrorDataService {
  public errorData: BehaviorSubject<any> = new BehaviorSubject<any>({
    "code": 200,
    "message": {
      "code": "",
      "params": [""]
    }
  });

  constructor() { }


  /**
   * Cập nhật dữ liệu chia sẻ với nội dung mới.
   * @param newContent Nội dung mới cần chia sẻ.
   */
  public updateData(newContent: any): void {
    this.errorData.next(newContent);
  }

  /**
 * Cập nhật dữ liệu về mạc định
 */
  public clearData(): void {
    this.errorData.next({
      "code": 200,
      "message": {
        "code": "",
        "params": [""]
      }
    })

  }
}
