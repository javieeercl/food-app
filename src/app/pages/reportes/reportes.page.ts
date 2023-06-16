import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { ToastController } from '@ionic/angular';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  totalSales: number = 0;
  mesSeleccionado = undefined;
  orders: Observable<Order[]>;
  mostrarTabla: boolean = false;
  mostrarBoton: boolean = true;
  selectedMonth: number[] = [];
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

  async exportToPDF() {
    // Crear una nueva instancia de jsPDF
    const pdf = new jsPDF();

    // Añadir el título del informe
    pdf.setFontSize(18);
    pdf.text('Reporte de Órdenes', 10, 10);

    // Añadir la fecha y hora de la generación del informe
    const now = new Date();
    pdf.setFontSize(11);
    pdf.text('Generado el: ' + now.toLocaleString(), 10, 20);

    // Convertir la tabla en un canvas usando html2canvas
    const content = document.querySelector('table');
    const canvas = await html2canvas(content, { scale: 1 });
    const imgData = canvas.toDataURL('image/png');

    // Añadir la tabla al PDF
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 30, pdfWidth, pdfHeight);

    // Añadir el total de ventas al final del informe
    pdf.setFontSize(14);
    pdf.text('Total de ventas: ' + this.totalSales.toFixed(2), 10, pdfHeight + 40);

    // Guardar el PDF
    pdf.save('reporte_pedidos.pdf');
  }


  async buscarOrdenes() {
    const ordersObservables: Observable<Order[]>[] = [];
    let emptyMonths = 0; // Contador de meses sin datos
    this.totalSales = 0;

    for (const month of this.selectedMonth) {
        const formattedMonth = month.toString().padStart(2, '0');
        const formattedYear = this.selectedYear.toString();

        const collectionPath = `orders/${formattedMonth}${formattedYear}`;
        const ordersRef = this.fdb.list<Order>(collectionPath);

        // Obtener un snapshot solo una vez para verificar si hay datos
        const ordersSnapshot = await ordersRef.query.once('value');
        if (!ordersSnapshot.exists()) {
            emptyMonths += 1;
        } else {
            // Si hay datos, suma los totales de los pedidos a totalSales
            ordersSnapshot.forEach(orderSnap => {
                this.totalSales += Number(orderSnap.val().priceOrder);
            });
        }

        ordersObservables.push(ordersRef.valueChanges());
    };

    // Si todos los meses seleccionados están vacíos, muestra un toast
    if (emptyMonths === this.selectedMonth.length) {
        this.presentToast('No se encontraron registros para los meses y año seleccionados.');
    } else {
        this.presentToast('Registros filtrados.');
    }

    this.orders = combineLatest(ordersObservables).pipe(
        map(arr => arr.reduce((acc, cur) => acc.concat(cur)))
    );

    this.mostrarTabla = true;
    this.mostrarBoton = false;
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
