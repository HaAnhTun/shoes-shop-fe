import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/model/User';
import { RegisterService } from 'src/app/service/register.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  registionForm = new FormGroup({
    firstName: new FormControl(""),
    lastName: new FormControl(""),
    login: new FormControl(""),
    passwordHash: new FormControl(""),
    confirmPassword: new FormControl(""),
    email: new FormControl(""),
    imageUrl: new FormControl(""),
  });

  constructor(
    private router : Router,
    private http : HttpClient,
    private registerService : RegisterService
  ){}

  ngOnInit(): void {
    console.log(this.registionForm.value);
  }
  
  registion() {
    const user = this.registionForm.value;
    console.log(this.registionForm.value);
    if(user.confirmPassword === user.passwordHash && user.passwordHash !== null){
      this.http.post("http://localhost:8088/api/register", user).subscribe(
      (data) =>  {
          this.router.navigate(['login'])  
          console.log(data)
        }
      )
    }else{
      console.log("k thanh cong")
    }
  }
}
