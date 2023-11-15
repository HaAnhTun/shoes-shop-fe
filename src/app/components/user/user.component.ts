import { group } from '@angular/animations';
import { Component } from '@angular/core';
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


export class UserComponent {
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

    this.userForm = this.formBuilder.group({
      id: '',
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      login: ['', Validators.required, [this.duplicateLogin()]],
      passwordHash: ['', Validators.required],
      email: ['', [Validators.required, Validators.email], [this.duplicateEmail()]],
      authorities: ['', Validators.required],
    })
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
      "imageUrl": this.userForm.get('imageUrl')?.value,
      "authorities": this.getRoleUser()
    }
    // Kiểm tra các trường bắt buộc
    if (!newUser.firstName || !newUser.lastName || !newUser.login || !newUser.passwordHash || !newUser.email || !newUser.authorities) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User Create Error',
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
            detail: 'User Create',
            life: 3000
          });
        },
        (error) => {
          console.error('Lỗi khi thêm người dùng:', error);
          // Xử lý lỗi một cách thích hợp, ví dụ: hiển thị thông báo lỗi cho người dùng.
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User Create Error',
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
            detail: 'User Update',
            life: 3000
          });
        },
        (error) => {
          console.error('Lỗi khi cập nhật người dùng:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User Update Error',
            life: 3000
          });
        }
      );
    }
    this.getAllUser();
    this.closeUserDialog();
  }

  deleteUser(user: User) {
    console.log("hi")
    this.confirmationService.confirm({
      message: 'Are you want to delete the selected user',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.delete(user).subscribe(
          reposive => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'User Deleted',
              life: 3000
            });
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'ERROR',
              detail: 'User Delete Error',
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
