import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitarGarzonPageRoutingModule } from './solicitar-garzon-routing.module';

import { SolicitarGarzonPage } from './solicitar-garzon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitarGarzonPageRoutingModule
  ],
  declarations: [SolicitarGarzonPage]
})
export class SolicitarGarzonPageModule {}
