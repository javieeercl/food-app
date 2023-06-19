import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { toDataURL } from 'pdfmake/build/pdfmake';

// Importa pdfMake y vfsFonts desde pdfmake/build
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  reportType: 'ventas' | 'reservas' | null = null;

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

  logoUrl: SafeResourceUrl;
  fechaReporte: string;
  horaReporte: string;

  constructor(
    private fdb: AngularFireDatabase,
    private toastController: ToastController,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.populateYears();
    this.loadLogo();
  }

  async loadLogo() {
    const response = await fetch('assets/img/logo_app.png');
    const logoBlob = await response.blob();
    const logoUrl = URL.createObjectURL(logoBlob);
    this.logoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(logoUrl);
  }

  async selectVentasReport() {
    this.reportType = 'ventas';
    await this.presentToast('Seleccionaste el reporte de ventas. Por favor, selecciona el mes y el año.');
  }

  async selectReservasReport() {
    this.reportType = 'reservas';
    await this.presentToast('Seleccionaste el reporte de reservas. Por favor, selecciona el mes y el año.');
  }

  populateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear; i++) {
      this.years.push(i);
    }
  }

  async exportToPDF() {
    // Obtener la imagen como un archivo de datos (data URL)
    const response = await fetch('assets/img/logo_app.png');
    const logoDataUrl = await response.blob();

    const reader = new FileReader();
    const logoPromise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(logoDataUrl);
    });

    const logoDataURL = await logoPromise;

    // Crear un nuevo documento PDF
    const docDefinition = {
      content: [],
      footer: (currentPage, pageCount) => {
        return { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center', fontSize: 10 };
      },
    };
    // Añadir el encabezado (header) con la imagen y el texto
    const header = {
      columns: [
        {
          image: logoDataURL,
          width: 50,
          height: 50,
        },
        {
          text: 'El Bajón del Rey',
          fontSize: 16,
          margin: [10, 10, 0, 0],
        },
      ],
    };
    docDefinition.content.push(header);

    // Agregar la fecha y hora del reporte
    const fechaHoraReporte = {
      text: [
        { text: 'Fecha reporte: ' },
        { text: this.fechaReporte, bold: true },
        { text: '\nHora reporte: ' },
        { text: this.horaReporte, bold: true },
      ],
      margin: [0, 10],
    };
    docDefinition.content.push(fechaHoraReporte);

    // Obtener los datos de la tabla
    const tableContent = [];
    const tableHeaders = [];
    const tableBody = [];

    // Obtener los encabezados de la tabla
    const tableHeadersElements = Array.from(document.querySelectorAll('#tablaDatos th'));
    tableHeadersElements.forEach((header) => {
      tableHeaders.push(header.textContent);
    });

    // Obtener los datos de la tabla
    const tableBodyRows = Array.from(document.querySelectorAll('#tablaDatos tbody tr'));
    tableBodyRows.forEach((row) => {
      const rowData = [];
      Array.from(row.querySelectorAll('td')).forEach((cell) => {
        rowData.push(cell.textContent);
      });
      tableBody.push(rowData);
    });

    // Agregar los encabezados y los datos de la tabla al documento PDF
    tableContent.push(tableHeaders);

    // Completar las celdas faltantes en las filas con valores vacíos
    const maxCells = Math.max(...tableBody.map((row) => row.length));
    tableBody.forEach((row) => {
      while (row.length < maxCells) {
        row.push('');
      }
      tableContent.push(row);
    });

    docDefinition.content.push({ table: { body: tableContent }, margin: [0, 10] });

    // Generar el documento PDF
    pdfMake.createPdf(docDefinition).download('reporte_pedidos.pdf');
  }

  async buscarData() {
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
    }

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

    // Obtener la fecha y hora actual
    this.fechaReporte = new Date().toLocaleDateString();
    this.horaReporte = new Date().toLocaleTimeString();
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
}
