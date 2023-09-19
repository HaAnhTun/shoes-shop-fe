import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { FooterComponent } from './component/common/footer.component';
import { HeaderComponent } from './component/common/header.component';

@NgModule({
  declarations: [ HeaderComponent, FooterComponent ],
  exports: [ HeaderComponent, FooterComponent ],
  imports: [
    AppRoutingModule
  ]
})
export class SharedModule {
}