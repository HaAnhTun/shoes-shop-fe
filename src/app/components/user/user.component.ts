import { group } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Order } from 'src/app/model/Order';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/service/user.service';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Observable, of, map, catchError, forkJoin } from 'rxjs';
import { AddressService } from 'src/app/service/address.service';

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

  filteredProvinces: any[] = [];
  filteredDistricts: any[] = [];
  filteredWard: any[] = [];

  provines: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  province: any;
  district: any;
  ward: any;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private addressService: AddressService
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
      passwordHash: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email], [this.duplicateEmail()]],
      dob: [''],
      selectedProvince: [''],
      selectedDistrict: [''],
      selectedWard: [''],
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
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Đã xóa người dùng',
              life: 3000
            });

            this.ngOnInit()
          },
          () => {
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
        let observablesProvince: Observable<any>[] = [];
        let observablesDistrict: Observable<any>[] = [];
        let observablesWard: Observable<any>[] = [];
  
        for (let i = 0; i < response.length; i++) {
          observablesProvince.push(
            this.addressService.getProvines().pipe(
              map((res) => {
                let listProvinces = res.results;
                for (let j = 0; j < listProvinces.length; j++) {
                  if (listProvinces[j].province_id == response[i].userAddress.province) {
                    return listProvinces[j];
                  }
                }
              })
            )
          );
          observablesDistrict.push(
            this.addressService.getDistrict1(response[i].userAddress.province).pipe(
              map((res) => {
                let listDistrict = res.results;
                for (let j = 0; j < listDistrict.length; j++) {
                  if (listDistrict[j].district_id == response[i].userAddress.district) {
                    return listDistrict[j];
                  }
                }
              })
            )
          );
  
          observablesWard.push(
            this.addressService.getWard(response[i].userAddress.district).pipe(
              map((res) => {
                let listWard = res.results;
                for (let j = 0; j < listWard.length; j++) {
                  if (listWard[j].ward_id == response[i].userAddress.ward) {
                    return listWard[j];
                  }
                }
              })
            )
          );
        }
  
        forkJoin(observablesProvince).subscribe((provinces) => {
          for (let i = 0; i < response.length; i++) {
            let province: any = provinces[i];
            if (province) {
              response[i].userAddress.provinceName = province?.province_name;
            }
          }
        });

        forkJoin(observablesDistrict).subscribe((districts) => {
          for (let i = 0; i < response.length; i++) {
            let district: any = districts[i];
            if (district) {
              response[i].userAddress.districtName = district?.district_name;
            }
          }
        });

        forkJoin(observablesWard).subscribe((wards) => {
          for (let i = 0; i < response.length; i++) {
            let ward: any = wards[i];
            if (ward) {
              response[i].userAddress.wardName = ward?.ward_name;
            }
          }
        });
        this.orderData[user.id] = response;
        console.log(response)
      }
    );
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
  getProvince(event: any) {
    let listProvinces = []
    this.addressService.getProvines().subscribe((res) => {
      listProvinces = res.results;
      for(let i = 0; i < listProvinces.length; i++){ 
        if(listProvinces[i].province_id == event){
          console.log(listProvinces[i])
          return listProvinces[i]
        }
      }
    });
  }
  transform(value: number): string {
    // Chuyển đổi giá trị thành chuỗi
    let stringValue = value.toString();

    // Thêm số 0 đằng trước nếu có một chữ số
    if (stringValue.length === 1) {
      return '0' + stringValue;
    }

    // Trả về giá trị nguyên vẹn nếu có nhiều hơn một chữ số
    return stringValue;
  }



  filterProvine(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.provines as any[]).length; i++) {
        let provine = (this.provines as any[])[i];
        if (provine.province_name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(provine);
        }
    }

    this.filteredProvinces = filtered;
  }

  filterDistrict(event: any) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.districts as any[]).length; i++) {
        let district = (this.districts as any[])[i];
        if (district.district_name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(district);
        }
    }
    this.filteredDistricts = filtered;
  }

  filterWard(event: any) {
    let filtered: any[] = [];
    let query = event.query;
    console.log(this.wards)
    for (let i = 0; i < (this.wards as any[]).length; i++) {
        let ward = (this.wards as any[])[i];
        if (ward.ward_name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(ward);
        }
    }
    this.filteredWard = filtered;
  }

  changeWard(event: any){
    this.ward = event;
  }

  getDistrict(event: any) {
    this.province = event;
    this.addressService.getDistrict1(event.province_id).subscribe((res) => {
      this.districts = res.results;
      console.log(this.districts)
    });
  }
  getWard(event: any) {
    this.district = event;
    this.addressService.getWard(event.district_id).subscribe((res) => {
      this.wards = res.results;
    });
  }
}

