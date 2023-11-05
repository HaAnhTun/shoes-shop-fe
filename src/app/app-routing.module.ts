import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./components/home/home.component";
import { ShopComponent } from "./components/shop/shop.component";
import { ManageComponent } from "./components/manage/manage.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { AppLayoutComponent } from "./layout/app.layout.component";
import { ShoesCategoryComponent } from "./components/shoes-category/shoes-category.component";
import { ProductComponent } from "./components/product/product.component";
import { BrandComponent } from "./components/brand/brand.component";
import { OderComponent } from "./components/oder/oder.component";
import { ShoesDetailComponent } from "./components/shoes-detail/shoes-detail.component";
import { ShoesDetailAddComponent } from "./components/shoes-detail-add/shoes-detail-add.component";
import { DiscountComponent } from "./components/discount/discount.component";
import { DiscountAddComponent } from "./components/discount-add/discount-add.component";
import { ColorComponent } from "./components/color/color.component";
import { SizeComponent } from "./components/size/size.component";
import { UserComponent } from "./components/user/user.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
const routes: Routes = [
  { ///ADMIN LINKS
    path: "admin",
    component: AppLayoutComponent, //trang layout mạc định  (http://localhost:4200/admin)
    children: [
      { path: "", component: DashboardComponent }, //các component con (http://localhost:4200/admin)
      { path: "home", component: HomeComponent }, //các component con (http://localhost:4200/admin/home)
      { path: "shop", component: ShopComponent },
      { path: "manage", component: ManageComponent },
      { path: "shoes", component: ProductComponent },
      {
        path: "shoes-category",
        component: ShoesCategoryComponent,
      },
      { path: "brand", component: BrandComponent },
      { path: "discount", component: DiscountComponent },
      { path: "discount-add", component: DiscountAddComponent },
      { path: "discount-details/:id", component: DiscountAddComponent },
      { path: "color", component: ColorComponent },
      { path: "size", component: SizeComponent },
      { path: "oder", component: OderComponent },
      { path: "shoes-detail", component: ShoesDetailComponent },
      { path: "shoes-detail-add", component: ShoesDetailAddComponent },
      { path: "users", component: UserComponent}
    ],
  },
  /////CLIENT-LINKs
  { path: "home", component: HomeComponent },
  { path: "product", component: ProductComponent },
  { path: "shop", component: ShopComponent },
  { path: "manage", component: ManageComponent },
  { path: "register", component: RegisterComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "shoes-categories", component: ShoesCategoryComponent },
  { path: "**", component: LoginComponent },
  { path: "users", component: UserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
