import { group } from '@angular/animations';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Order } from 'src/app/model/Order';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/service/user.service';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  userForm: FormGroup;
  user: any;
  orderData: { [userId: number]: Order[] } = {};
  role: SelectItem[]
  status: any[]
  showPassword: boolean = true;

  userDialog: boolean = false;
// const roleControls = this.role.map(role => this.formBuilder.control(true));
  constructor(
    private userService: UserService,
    private formBuilder : FormBuilder,
    private messageService : MessageService,
    private confirmationService : ConfirmationService
  ) {
    this.role = [
      { label: 'User', value: 'ROLE_USER'},
      { label: 'Admin', value: 'ROLE_ADMIN'}
    ]
    
    this.userForm = this.formBuilder.group({
      id: '',
      firstName: ['', Validators.required],
      lastName: '',
      login: '',
      passwordHash: '',
      email: '',
      authorities: this.formBuilder.array([])
    })
  }

  ngOnInit() {
      this.getAllUser();
      window.onbeforeunload = this.reloadPageOnDialogClose;
  }

  getAllUser(){
    this.userService.getAllUser().subscribe(
      data => {
      this.user = data
      console.log(data)
      if (!Array.isArray(this.user)) {
        this.getOrder(this.user as User);
      }
    });
  }

  addUser() {
    const newUser = { ...this.userForm.value };
    console.log(newUser)
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
    this.closeUserDialog();
  }
  
  deleteUser(user : User){
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

 editUser(user : User){
    this.userDialog = true
    this.showPassword = false;
    this.userForm.setValue({
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      login: user.login,
      passwordHash: user.passwordHash,
      email: user.email,
      authorities: [user.authorities]
    });
  }
  
  getOrder(user: User){
    console.log(user)
    this.userService.getOrderById(user.id).subscribe(
      (response) => {
        this.orderData[user.id] = response
      }
    )
  }

  addAuthority(value: string) {
    const authoritiesArray = this.userForm.get('authorities') as FormArray;
    console.log(authoritiesArray)
    authoritiesArray.push(new FormControl(value)); // Thêm giá trị từ dropdown vào FormArray
  }

  getRole(authorities : string){
    return authorities === "User" ? "ROLE_USER" : "ROLE_ADMIN";
  }

  getStatus(status : boolean){
    if(status == true){
      return "ACCEPTED";
    }else {
      return "DELETED";
    }
  }

  getSererity(status : boolean){
    return status == true ? "infor" : "danger";
  }

  openUserDal(){
    this.userForm.reset();
    this.userDialog = true;
  }

   closeUserDialog() {
    const authoritiesArray = this.userForm.get('authorities') as FormArray;
    authoritiesArray.clear();
    this.userDialog = false;
  }

  reloadPageOnDialogClose(): void {
    // Điều này sẽ reload trang khi tắt dialog
    location.reload();
  }
}
