import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { ToastController } from '@ionic/angular';

interface Order {

  id: string;
  priceOrder: string;
  date: string;
  user: string;
  time: string;
  // Agrega aquí los campos adicionales de la orden que deseas mostrar en la tabla
}

interface MonthOption {
  value: number;
  label: string;
}

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {
  mesSeleccionado = undefined;
  orders: Observable<Order[]>;
  mostrarTabla: boolean = false;
  mostrarBoton: boolean = true;
  selectedMonth: number;
  selectedYear: number;
  months: MonthOption[] = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];
  years: number[] = [];

  constructor(
    private fdb: AngularFireDatabase,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.populateYears();
  }

  populateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear; i++) {
      this.years.push(i);
    }
  }

  async buscarOrdenes() {
    // Convertir el mes y el año a su formato correspondiente
    const formattedMonth = this.selectedMonth.toString().padStart(2, '0');
    const formattedYear = this.selectedYear.toString();

    // Obtener la referencia a la colección adecuada
    const collectionPath = `orders/${formattedMonth}${formattedYear}`;
    const ordersRef = this.fdb.list<Order>(collectionPath);

    try {
      // Obtener los datos de la colección
      this.orders = ordersRef.valueChanges();

      // Mostrar la tabla y ocultar el botón
      this.mostrarTabla = true;
      this.mostrarBoton = false;

      // Verificar si no hay registros y mostrar un toast
      const ordersSnapshot = await ordersRef.query.once('value');
      if (!ordersSnapshot.exists()) {
        this.mostrarTabla = false;
        this.mostrarBoton = true;
        this.presentToast('No se encontraron registros para el mes y año seleccionados.');
      } else {
        this.presentToast('Registros filtrados.');
      }
    } catch (error) {
      console.error('Error al buscar las órdenes:', error);
      this.presentToast('Ocurrió un error al buscar las órdenes. Por favor, inténtalo de nuevo más tarde.');
    }
  }

  handleChange(ev) {
    this.mesSeleccionado = ev.target.value;
    console.log(this.mesSeleccionado);

  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
    });
    toast.present();
  }

  otroBoton() {
    // Aquí puedes implementar la lógica para el otro botón
    console.log('Presionaste el otro botón');
    this.mostrarBoton = true;
  }

  verDetalles(orderId: string) {
    // Aquí puedes implementar la lógica para mostrar los detalles de la orden seleccionada
    console.log('Ver detalles de la orden con ID:', orderId);
  }
}
