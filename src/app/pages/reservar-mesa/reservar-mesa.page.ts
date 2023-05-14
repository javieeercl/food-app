import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-reservar-mesa',
  templateUrl: './reservar-mesa.page.html',
  styleUrls: ['./reservar-mesa.page.scss'],
})
export class ReservarMesaPage implements OnInit {

  fecha: string;
  hora: string;
  nombre: string;
  currentYear: number;
  horaValues: string[] = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  minutoValues: string[] = ['00', '15', '30', '45'];


  constructor(private toastController: ToastController) { 
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit() {
  }

  async reservar() {
    if (!this.fecha || !this.hora || !this.nombre) {
      const toast = await this.toastController.create({
        message: 'Por favor complete todos los campos.',
        duration: 2000
      });
      toast.present();
      return;
    }

   // Aquí debes guardar la reserva en el sistema, por ejemplo, en una base de datos.
    // Después, puedes generar un código y mostrarlo al usuario en la siguiente línea.

    const codigo = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const toast = await this.toastController.create({
      message: `Su mesa ha sido reservada. Código: ${codigo}`,
      duration: 5000
    });
    toast.present();
  }  
}
