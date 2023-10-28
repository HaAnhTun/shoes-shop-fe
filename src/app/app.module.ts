import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";

import { BrowserModule } from "@angular/platform-browser";
import { AnimateModule } from "primeng/animate";
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DataViewModule } from "primeng/dataview";
import { DataViewLayoutOptions } from "primeng/dataview";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button";
import { RatingModule } from "primeng/rating";
import { HomeComponent } from "./components/home/home.component";
import { ShopComponent } from "./components/shop/shop.component";
import { ManageComponent } from "./components/manage/manage.component";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { HttpClientModule } from "@angular/common/http";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component"; // Import the HttpClientModule
import { Menubar, MenubarModule } from "primeng/menubar";
import { CarouselModule } from "primeng/carousel";
import { ImageModule } from "primeng/image";
import { GalleriaModule } from "primeng/galleria";
import { ChartModule } from "primeng/chart";
import { LoginComponent } from "./components/login/login.component";
import { FormGroup, FormsModule } from "@angular/forms";
import { TokenInterceptor } from "./shared/auth/token.interceptor";
import { RegisterComponent } from "./components/register/register.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { AppLayoutModule } from "./layout/app.layout.module";
import { ShoesCategoryComponent } from "./components/shoes-category/shoes-category.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ProductComponent } from "./components/product/product.component";
import { AutoCompleteModule } from "primeng/autocomplete";
import { MessagesModule } from "primeng/messages";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { ConfirmationService, MessageService } from "primeng/api";
import { FileUploadModule } from "primeng/fileupload";
import { ToolbarModule } from "primeng/toolbar";
import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { TriStateCheckboxModule } from "primeng/tristatecheckbox";
import { OrderListModule } from "primeng/orderlist";
import { InputTextareaModule } from "primeng/inputtextarea";
import { TreeSelectModule } from "primeng/treeselect";
import { BrandComponent } from "./components/brand/brand.component";
import { DropdownModule } from "primeng/dropdown";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { OderComponent } from "./components/oder/oder.component";
import { ShoesDetailComponent } from "./components/shoes-detail/shoes-detail.component";
import { ShoesDetailAddComponent } from "./components/shoes-detail-add/shoes-detail-add.component";
import { TabViewModule } from "primeng/tabview";
import { DiscountComponent } from "./components/discount/discount.component";
import { InputNumberModule } from "primeng/inputnumber";
import { InputSwitchModule } from "primeng/inputswitch";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShopComponent,
    ManageComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ShoesCategoryComponent,
    ProductComponent,
    BrandComponent,
    OderComponent,
    ShoesDetailComponent,
    ShoesDetailAddComponent,
    DiscountComponent,
  ],
  imports: [
    AppLayoutModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TagModule,
    DropdownModule,
    RatingModule,
    DataViewModule,
    TableModule,
    ButtonModule,
    HttpClientModule,
    MenubarModule,
    CarouselModule,
    ImageModule,
    GalleriaModule,
    ChartModule,
    ReactiveFormsModule,
    DialogModule,
    MessagesModule,
    ConfirmPopupModule,
    AutoCompleteModule,
    FileUploadModule,
    ToolbarModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    CheckboxModule,
    RadioButtonModule,
    TriStateCheckboxModule,
    OrderListModule,
    InputTextareaModule,
    TreeSelectModule,
    TabViewModule,
    InputNumberModule,
    InputSwitchModule
  ],
  providers: [
    DataViewLayoutOptions,
    TokenInterceptor,
    MessageService,
    ConfirmationService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule { }
