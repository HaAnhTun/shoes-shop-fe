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
import { LandingComponent } from "./components/landing/landing.component";
import { LayoutComponent } from "./layout/client/layout/layout.component";
import { ClientHomeComponent } from "./components/client/home/client.home.component";
import { CartComponent } from "./components/client/cart/cart.component";
import { ShoesInspectComponent } from "./components/client/shoes-inspect/shoes-inspect.component";
import { OrderDetailsComponent } from "./components/order-details/order-details.component";
import { PayComponent } from "./components/client/pay/pay.component";
import { LoginCustomerComponent } from "./components/login-customer/login-customer.component";
import { RegisterCustomerComponent } from "./components/register-customer/register-customer.component";
import { UserOrderComponent } from "./components/user-order/user-order.component";
import { AboutComponent } from "./components/client/about/about.component";
import { ContactComponent } from "./components/client/contact/contact.component";
import { DiscountShoesComponent } from "./components/discount-shoes/discount-shoes.component";
import { PaySuccessComponent } from "./components/client/pay-success/pay-success.component";
import { PayFaileComponent } from "./components/client/pay-faile/pay-faile.component";
import { ShoesComponent } from "./components/shoes/shoes.component";
import { FeedbackManagComponent } from "./components/feedback-manag/feedback-manag.component";
import { ReturnOrderComponent } from "./components/return-order/return-order.component";
import { OrderReturnAdminComponent } from "./components/order-return-admin/order-return-admin.component";
import { OrderReturnDetailsComponent } from "./components/order-return-details/order-return-details.component";
import { ColorRemovedComponent } from "./components/color-removed/color-removed.component";
import { SizeRemovedComponent } from "./components/size-removed/size-removed.component";
import { BrandRemovedComponent } from "./components/brand-removed/brand-removed.component";
import { ProfileComponent } from "./components/client/profile/profile.component";
import { CodeForgotPasswordComponent } from "./components/client/code-forgot-password/code-forgot-password.component";
const routes: Routes = [
  {
    ///ADMIN LINKS
    path: "admin",
    component: AppLayoutComponent, //trang layout mạc định  (http://localhost:4200/admin)
    children: [
      { path: "", component: DashboardComponent }, //các component con (http://localhost:4200/admin)
      { path: "home", component: HomeComponent }, //các component con (http://localhost:4200/admin/home)
      { path: "shop", component: ShopComponent },
      { path: "manage", component: ManageComponent },
      { path: "feedback", component: FeedbackManagComponent },
      // { path: "shoes", component: ProductComponent },
      {
        path: "shoes-category",
        component: ShoesCategoryComponent,
      },
      { path: "brand", component: BrandComponent },
      { path: "discount", component: DiscountComponent },
      { path: "order-returns", component: OrderReturnAdminComponent },
      { path: "discount-add", component: DiscountAddComponent },
      { path: "discount-details/:id", component: DiscountAddComponent },
      {
        path: "order-return-details/:id",
        component: OrderReturnDetailsComponent,
      },
      { path: "color", component: ColorComponent },
      { path: "size", component: SizeComponent },
      { path: "orders", component: OderComponent },
      { path: "shoes-detail", component: ShoesDetailComponent },
      { path: "shoes", component: ShoesComponent },
      { path: "shoes-detail-add", component: ShoesDetailAddComponent },
      { path: "users", component: UserComponent },
      { path: "order-details/:id", component: OrderDetailsComponent },
      { path: "removedColor", component: ColorRemovedComponent },
      { path: "removedSize", component: SizeRemovedComponent },
      { path: "removedBrand", component: BrandRemovedComponent },
    ],
  },
  {
    path: "client",
    component: LayoutComponent,
    children: [
      { path: "", component: ClientHomeComponent },
      { path: "home", component: ClientHomeComponent },
      { path: "cart", component: CartComponent },
      { path: "shoes-detail", component: ShoesInspectComponent },
      { path: "shoes-detail/:id", component: ShoesInspectComponent },
      { path: "return-order/:id", component: ReturnOrderComponent },
      { path: "shop", component: ShopComponent },
      { path: "pay", component: PayComponent },
      { path: "about", component: AboutComponent },
      { path: "contact", component: ContactComponent },
      { path: "login-customer", component: LoginCustomerComponent },
      { path: "register-customer", component: RegisterCustomerComponent },
      { path: "discount", component: DiscountShoesComponent },
      { path: "login-customer", component: LoginCustomerComponent },
      { path: "register-customer", component: RegisterCustomerComponent },
      { path: "user-order", component: UserOrderComponent },
      { path: "pay-success", component: PaySuccessComponent },
      { path: "pay-faile", component: PayFaileComponent },
      { path: "order-details/:id", component: OrderDetailsComponent },
      { path: "profile", component: ProfileComponent },
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
  { path: "landing", component: LandingComponent },
  { path: "users", component: UserComponent },
  { path: "change-password", component: CodeForgotPasswordComponent },
  //không được viết path bên dưới thằng **
  { path: "**", component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
