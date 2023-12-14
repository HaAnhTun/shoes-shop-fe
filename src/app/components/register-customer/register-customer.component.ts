import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, of, map, catchError } from 'rxjs';
import { RegisterService } from 'src/app/service/register.service';

@Component({
  selector: 'app-register-customer',
  templateUrl: './register-customer.component.html',
  styleUrls: ['./register-customer.component.css']
})
export class RegisterCustomerComponent{

  registionForm: FormGroup

  constructor(
    private router: Router,
    private http: HttpClient,
    private registerService: RegisterService,
    private messageService: MessageService,
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
    console.log(user)
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
}
