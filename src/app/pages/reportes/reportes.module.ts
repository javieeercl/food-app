import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportesPageRoutingModule } from './reportes-routing.module';

import { ReportesPage } from './reportes.page';
import { ReporteReservaComponent } from '../reporteReserva/reporteReserva.component';
import { ReporteVentaComponent } from '../reporteVenta/reporteVenta.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportesPageRoutingModule
  ],
  declarations: [ReportesPage, ReporteReservaComponent, ReporteVentaComponent]
})
export class ReportesPageModule {}
