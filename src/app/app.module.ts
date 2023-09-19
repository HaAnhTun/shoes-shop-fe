import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { AnimateModule } from 'primeng/animate';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataViewModule } from 'primeng/dataview';
import { DataViewLayoutOptions } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';
import { ManageComponent } from './components/manage/manage.component';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component'; // Import the HttpClientModule
import { MenubarModule } from 'primeng/menubar';
import { CarouselModule } from 'primeng/carousel';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { ChartModule } from 'primeng/chart';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShopComponent,
    ManageComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TagModule,
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
  ],
  providers: [DataViewLayoutOptions],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule {}
