import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: any;
  constructor(
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private fb: FormBuilder
  ){}

  resetPass(){
    this.userService.checkEmail(this.email).subscribe(
      (res)=>{
        if(res == true){
          this.userService.changePassword(this.email).subscribe(
            (res) => {
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: "Gửi mã thành công",
                life: 3000,
              });
      
              setTimeout(()=>{
                this.router.navigate(['/nhap-ma'])
              }, 3000)
            },
            (err) => {
              console.log('false')
            }
          )
        }else{
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Email chưa được đăng kí với hệ thống.",
            life: 3000,
          });
        }
      }
    )
    
  }
}
