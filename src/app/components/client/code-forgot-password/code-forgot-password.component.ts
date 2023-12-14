import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-code-forgot-password',
  templateUrl: './code-forgot-password.component.html',
  styleUrls: ['./code-forgot-password.component.css']
})
export class CodeForgotPasswordComponent {
  key: any;
  newPassword: any;
  keyAndPassword: any;
  constructor(
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ){}

  confirm(){
    this.userService.checkResetKey(this.key).subscribe(
      (res)=>{
        console.log(res)
        this.keyAndPassword = {
          resetKey : this.key,
          passwordHash: this.newPassword
        }
        if(res){
          this.userService.newPassword(this.keyAndPassword).subscribe(
            (data)=>{
              console.log("data = ", data)
            }
          );
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Mã xác nhận đúng, bạn đã thay đổi mật khẩu thành công.",
            life: 3000,
          });
  
          setTimeout(()=>{
            this.router.navigate(['/change-password'])
          }, 3000)
        }
      },
      (err)=>{
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Mã xác nhận k đúng, mời nhập lại.",
          life: 3000,
        });

      }
    )
  }
}
