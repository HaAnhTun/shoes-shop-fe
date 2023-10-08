import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';
import { ManageComponent } from './components/manage/manage.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeDemoComponent } from './components/home-demo/home-demo.component';
import { CommmonTemplateComponent } from './components/commmon-template/commmon-template.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { ShoesCategoryComponent } from './components/shoes-category/shoes-category.component';
const routes: Routes = [
  {
    path: 'admin', component: AppLayoutComponent, //trang layout mạc định  (http://localhost:4200/admin)
    children: [
      { path: '', component: ManageComponent },  //các component con (http://localhost:4200/admin)
      { path: 'home', component: HomeComponent }, //các component con (http://localhost:4200/admin/home)
      { path: 'shop', component: ShopComponent },
      { path: 'manage', component: ManageComponent },
    ]
  },
  //test link
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'manage', component: ManageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'test', component: CommmonTemplateComponent },
  { path: 'shoes-categories', component: ShoesCategoryComponent },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
