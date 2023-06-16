import { Component } from '@angular/core';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage {
  mostrarBoton: boolean = true;
  mostrarTabla: boolean = false;
  mostrarTablaReserva: boolean = false;
  ventas: any[] = []; // Arreglo de ventas
  reservas: any[] = []; // Arreglo de reservas

  mostrarTablaCompras() {
    // Lógica para obtener y asignar los datos de las ventas a la variable 'ventas'
    this.ventas = [
      { idUsuario: '1', producto: 'Hamburguesa Doritos', cantidad: 2, fecha: '13-05-2023' },
      { idUsuario: '2', producto: 'Hamburguesa Normal', cantidad: 1, fecha: '15-06-2023' },
      // Agrega aquí más datos de ventas
    ];

    this.mostrarTabla = true;
    this.mostrarTablaReserva = false;
  }

  mostrarTablaReservas() {
    // Lógica para obtener y asignar los datos de las reservas a la variable 'reservas'
    this.reservas = [
      { idUsuario: '1', cantidadMesas: 3, fecha: '13-05-2023' },
      { idUsuario: '2', cantidadMesas: 2, fecha: '15-06-2023' },
      // Agrega aquí más datos de reservas
    ];

    this.mostrarTabla = false;
    this.mostrarTablaReserva = true;
  }
}