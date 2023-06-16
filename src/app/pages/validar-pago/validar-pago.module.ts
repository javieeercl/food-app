import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValidarPagoPageRoutingModule } from './validar-pago-routing.module';

import { ValidarPagoPage } from './validar-pago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValidarPagoPageRoutingModule
  ],
  declarations: [ValidarPagoPage]
})
export class ValidarPagoPageModule {}
