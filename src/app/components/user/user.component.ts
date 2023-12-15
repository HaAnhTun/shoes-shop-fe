import { group } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Order } from 'src/app/model/Order';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/service/user.service';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Observable, of, map, catchError } from 'rxjs';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})


export class UserComponent implements OnInit {
  userForm: FormGroup;
  user: any;
  orderData: { [userId: number]: Order[] } = {};
  role: any[]
  status: any[]
  showPassword: boolean = true;

  userDialog: boolean = false;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.role = [
      { label: 'User', value: 'ROLE_USER' },
      { label: 'Admin', value: 'ROLE_ADMIN' }
    ]

    this.status = [
      { code: 0, name: "Chờ xác nhận" },
      { code: 1, name: "Chờ giao" },
      { code: 2, name: "Đang giao" },
      { code: 3, name: "Hoàn thành" },
      { code: 4, name: "Chờ thanh toán" },
      { code: -1, name: "Hủy" },
    ]
    this.userForm = this.formBuilder.group({
      id: '',
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      login: ['', Validators.required, [this.duplicateLogin()]],
      passwordHash: ['', Validators.required],
      email: ['', [Validators.required, Validators.email], [this.duplicateEmail()]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
        ],
        [
          this.asyncValidateFirstDigit.bind(this)
        ]
      ],
      authorities: ['', Validators.required],
    })
  }


  asyncValidateFirstDigit(control: AbstractControl): Observable<ValidationErrors | null> {
    const value = control.value as string;

    if (value && value.charAt(0) !== '0') {
      return of({ invalidFirstDigit: true });
    }

    return of(null);
  }

  getStatusName(code: number): string {
    const statusObj = this.status.find(s => s.code === code);
    return statusObj ? statusObj.name : 'Không xác định';
  }

  ngOnInit() {
    this.getAllUser();
  }

  getAllUser() {
    this.userService.getAllUser().subscribe(
      data => {
        this.user = data
        console.log(data)
        if (!Array.isArray(this.user)) {
          this.getOrder(this.user as User);
        }
      });
  }

  isFormControlInvalidAndTouched(formControlName: string) {
    const control = this.userForm.get(formControlName);
    return control?.invalid && (control?.touched || control?.dirty);
  }

  getRoleUser(): string[] {
    let listString: string[] = []
    const listAny = this.userForm.get('authorities')?.value
    console.log(listAny)
    // listAny.forEach((element: { label: string, value: string; }) => {
    listString.push(listAny.value)
    // });
    return listString;
  }

  addUser() {
    // const newUser = { ...this.userForm.value };
    const newUser = {
      "id": this.userForm.get('id')?.value,
      "login": this.userForm.get('login')?.value,
      "passwordHash": this.userForm.get('passwordHash')?.value,
      "firstName": this.userForm.get('firstName')?.value,
      "lastName": this.userForm.get('lastName')?.value,
      "email": this.userForm.get('email')?.value,
      "phone": this.userForm.get('phone')?.value,
      "imageUrl": this.userForm.get('imageUrl')?.value,
      "authorities": this.getRoleUser()
    }
    // Kiểm tra các trường bắt buộc
    if (!newUser.firstName || !newUser.lastName || !newUser.login || !newUser.passwordHash || !newUser.email || !newUser.phone || !newUser.authorities) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Thêm mới người dùng thất bại',
        life: 3000
      });
      return;
    }

    if (!newUser.id) {
      // Thêm người dùng mới

      console.log(newUser)
      this.userService.save(newUser).subscribe(
        (response) => {
          console.log('Người dùng đã được thêm:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Thêm mới người dùng thành công',
            life: 3000
          });

          this.ngOnInit()
        },
        (error) => {
          console.error('Lỗi khi thêm người dùng:', error);
          // Xử lý lỗi một cách thích hợp, ví dụ: hiển thị thông báo lỗi cho người dùng.
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Thêm mới người dùng thất bại',
            life: 3000
          });
        }
      );
    } else {
      // Cập nhật người dùng

      this.userService.update(newUser).subscribe(
        (response) => {
          console.log('Người dùng đã được cập nhật:', response);
          // Đóng hộp thoại hoặc thực hiện các tác vụ cần thiết khác.
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Người dùng đã được cập nhật',
            life: 3000
          });

          this.ngOnInit()
        },
        (error) => {
          console.error('Lỗi khi cập nhật người dùng:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Lỗi khi cập nhật người dùng',
            life: 3000
          });
        }
      );
    }
    this.closeUserDialog();
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: 'Bạn muốn xóa người dùng đang chọn?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.delete(user).subscribe(
          reposive => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Đã xóa người dùng',
              life: 3000
            });

            this.ngOnInit()
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'ERROR',
              detail: 'Xóa người dùng lỗi',
              life: 3000
            });
          }
        )
      }
    })
  }

  editUser(user: User) {
    this.userDialog = true
    this.showPassword = false;

    this.userForm.patchValue({
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      login: user.login,
      passwordHash: user.passwordHash,
      email: user.email,
      phone: user.phone,
      authorities: user.authorities[0] == 'ROLE_USER' ? { label: 'User', value: 'ROLE_USER' } : { label: 'Admin', value: 'ROLE_ADMIN' }
    });

  }

  getOrder(user: User) {
    this.userService.getOrderById(user.id).subscribe(
      (response) => {
        this.orderData[user.id] = response
      }
    )
  }

  openUserDal() {
    this.userForm.reset();
    this.userDialog = true;
    this.showPassword = true
  }

  closeUserDialog() {
    this.userDialog = false;
  }

  list: any[]

  filterList(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.role.length; i++) {
      let products = this.role[i];
      if (products.label?.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(products);
      }
      console.log(products)
    }
    this.list = filtered
  }

  duplicateLogin(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const controlValue = control.value;

      if (!controlValue) {
        return of(null);
      }

      return this.userService.usernameExist(controlValue).pipe(
        map((response) => {
          if (response != null) {
            return { duplicateLogin: true };
          } else {
            return null;
          }
        }),
        catchError(() => of(null))
      );
    };
  }


  duplicateEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const emailValue = control.value;

      if (!emailValue) {
        return of(null);
      }

      return this.userService.emailExist(emailValue).pipe(
        map((response) => {
          if (response != null) {
            return { duplicateEmail: true };
          } else {
            return null;
          }
        }),
        catchError(() => of(null))
      );
    };
  }
}
