import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

interface Order {
  id: string;
  user: string;
  address: string;
  // Agrega aquí los campos adicionales de la orden que deseas mostrar en la tabla
}

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {
  ordersCollection: AngularFirestoreCollection<Order>;
  orders: Observable<Order[]>;
  mostrarTabla: boolean = false;
  mostrarBoton: boolean = true;

  constructor(private firestore: AngularFirestore) {
    this.ordersCollection = this.firestore.collection<Order>('orders');
    this.orders = this.ordersCollection.valueChanges();
  }

  ngOnInit() {
    // Obtener las órdenes de la base de datos
    this.orders.subscribe((data) => {
      console.log(data); // Aquí puedes procesar los datos recibidos y mostrarlos en la página
    });
  }

  mostrarTablaCompras() {
    // Aquí puedes implementar la lógica para mostrar la tabla de compras
    this.mostrarTabla = true;
    this.mostrarBoton = false;
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