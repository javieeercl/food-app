import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ListProductOrderComponent } from './list-product-order/list-product-order.component';




@NgModule({
  declarations: [FooterComponent, HeaderComponent, LoginComponent,
    CreateAccountComponent, ListProductOrderComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    CreateAccountComponent,
    ListProductOrderComponent
  ]
})
export class SharedModule {

}
