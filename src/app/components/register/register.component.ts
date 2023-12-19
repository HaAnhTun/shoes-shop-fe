import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { Observable, catchError, map, of, switchMap, timer } from "rxjs";
import { User } from "src/app/model/User";
import { AddressService } from "src/app/service/address.service";
import { RegisterService } from "src/app/service/register.service";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent{

  registionForm: FormGroup
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
    private router: Router,
    private http: HttpClient,
    private registerService: RegisterService,
    private messageService: MessageService,
    private addressService: AddressService,
    private fb: FormBuilder // Sử dụng FormBuilder để tạo FormGroup
  ) {
    this.registionForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      login: ['', Validators.required, [this.duplicateLogin()]],
      passwordHash: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
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
    }, {
      validator: this.mustMatch('passwordHash', 'confirmPassword')
    });
  }

  registion() {
    const user = this.registionForm.value;
    console.log(this.registionForm.value);
    if (
      user.confirmPassword === user.passwordHash &&
      user.passwordHash !== null
    ) {
      this.http
        .post("http://localhost:8088/api/register", user).subscribe(
          response => {
            this.router.navigate(["login"]);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Registration successful',
              life: 3000
            });
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'ERROR',
              detail: 'Registration Error',
              life: 3000
            });
          });
    } else {
      console.log("k thanh cong");
    }
  }
  
  isFormControlInvalidAndTouched(formControlName: string) {
    const control = this.registionForm.get(formControlName);
    return control?.invalid && (control?.touched || control?.dirty);
  }

  mustMatch(password: any, confirmPassword: any) {
    return (control: FormControl) => {
      const passwordControl = control.get(password);
      const confirmPasswordControl = control.get(confirmPassword);

      if (confirmPasswordControl?.errors && !confirmPasswordControl.errors['mustMatch']) {
        return;
      }

      if (passwordControl?.value !== confirmPasswordControl?.value) {
        confirmPasswordControl?.setErrors({ mustMatch: true });
      } else {
        confirmPasswordControl?.setErrors(null);
      }
    };
  }

  duplicateLogin(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const controlValue = control.value;
  
      if (!controlValue) {
        return of(null);
      }
  
      return this.registerService.usernameExist(controlValue).pipe(
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
      const controlValue = control.value;
  
      if (!controlValue) {
        return of(null);
      }
  
      return this.registerService.emailExist(controlValue).pipe(
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

  asyncValidateFirstDigit(control: AbstractControl): Observable<ValidationErrors | null> {
    const value = control.value as string;

    if (value && value.charAt(0) !== '0') {
      return of({ invalidFirstDigit: true });
    }

    return of(null);
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

