import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidarPagoPage } from './validar-pago.page';

const routes: Routes = [
  {
    path: '',
    component: ValidarPagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidarPagoPageRoutingModule {}
