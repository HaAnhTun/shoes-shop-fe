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
  key: any
  constructor(
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ){}

  confirm(){
    this.userService.checkActivationKey(this.key).subscribe(
      (res)=>{
        console.log('ok')
      },
      (err)=>{
        console.log('deo ok')
      }
    )
  }
}
