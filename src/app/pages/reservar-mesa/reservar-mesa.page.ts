import { ToastService } from './../../services/toast.service';
import { UserService } from './../../services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/compat/database'; // change this if necessary
import { ReservaService } from 'src/app/services/reserva.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-reservar-mesa',
  templateUrl: './reservar-mesa.page.html',
  styleUrls: ['./reservar-mesa.page.scss'],
})
export class ReservarMesaPage implements OnInit {

  isFechaSelected: boolean = false;
  isMesaSelected: boolean = false;

  fecha: string;
  hora: string;
  nombre: string;
  mesaId: string;
  currentYear: number;
  horaValues: string[] = ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  mesas: any[];

  constructor(private toastService: ToastService,private userService: UserService,private auth: AuthService, private toastController: ToastController, private db: AngularFireDatabase, private reservaService: ReservaService) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit() {
    this.db.list('mesas').valueChanges().subscribe(data => {
      this.mesas = data;
      this.updateHorasDisponibles();
    });
  }

  checkFecha() {
    let fechaSeleccionada = new Date(this.fecha);
    fechaSeleccionada.setHours(0, 0, 0, 0); // Set to start of the day

    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to start of the day

    // Check if selected date is in the past
    if (fechaSeleccionada.getTime() < currentDate.getTime()) {
      this.toastController.create({
        message: 'No se pueden seleccionar fechas pasadas.',
        duration: 2000
      }).then(toast => toast.present());
      this.isFechaSelected = false;
      this.isMesaSelected = false;
    } else {
      this.isFechaSelected = true;
      // Restablecer la mesa y la hora cuando se cambia la fecha
      this.mesaId = null;
      this.hora = null;
      this.isMesaSelected = false;
      this.updateHorasDisponibles();
    }
  }




  updateHorasDisponibles() {
    this.isFechaSelected = !!this.fecha; // Actualiza isFechaSelected cuando la fecha es seleccionada

    let fechaSeleccionada = new Date(this.fecha);
    fechaSeleccionada.setHours(0, 0, 0, 0); // Set to start of the day

    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to start of the day

    // Check if selected date is in the past
    if (fechaSeleccionada.getTime() < currentDate.getTime()) {
      this.toastController.create({
        message: 'No se pueden seleccionar fechas pasadas.',
        duration: 2000
      }).then(toast => toast.present());
      return;
    }

    let mesa = this.mesas.find(m => m.id === this.mesaId);
    if (!mesa) return;

    if (fechaSeleccionada.getTime() !== currentDate.getTime()) {
      // If the selected date is not today, all hours are available
      this.horaValues = ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    } else {
      // If the selected date is today, filter out the past hours
      this.horaValues = ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'].filter(hora => {
        let horaIndex = mesa.reservas.findIndex(r => r.horaInicio === 'T' + hora + ':00:00.000Z');
        return !mesa.reservas[horaIndex].reservado;
      });
    }
  }


updateHorasAfterMesaSelection() {
  this.isMesaSelected = !!this.mesaId; // Actualiza isMesaSelected cuando la mesa es seleccionada
  this.updateHorasDisponibles();
}

  async reservar() {
    if (!this.fecha || !this.hora || !this.nombre || !this.mesaId) {
      const toast = await this.toastController.create({
        message: 'Por favor complete todos los campos.',
        duration: 2000
      });
      toast.present();
      return;
    }

    const reservaDate = new Date(this.fecha + ' ' + this.hora + ':00:00');
    const currentDate = new Date();

    // Ensure reservation is in the future
    if (reservaDate < currentDate) {
      const toast = await this.toastController.create({
        message: 'Solo puedes hacer reservas a partir de hoy.',
        duration: 2000
      });
      toast.present();
      return;
    }

    // Get mesa
    let mesaRef = this.db.database.ref('/mesas/' + this.mesaId);
    mesaRef.once('value').then(snapshot => {
      let mesaData = snapshot.val();

      let reservaIndex = mesaData.reservas.findIndex(
        r => r.horaInicio === 'T' + this.hora + ':00:00.000Z'
      );

      // If reserva not found
      if (reservaIndex === -1) {
        this.toastController.create({
          message: 'Reserva no encontrada para este horario.',
          duration: 2000
        }).then(toast => toast.present());
        return;
      }

      // If reserva is already reserved
      if (mesaData.reservas[reservaIndex].reservado) {
        this.toastController.create({
          message: 'Esta hora ya está reservada.',
          duration: 2000
        }).then(toast => toast.present());
        return;
      }

      // If reserva is available
      mesaData.reservas[reservaIndex].reservado = true;
      mesaRef.update(mesaData);
      this.createHistReserva(mesaData);

      this.toastController.create({
        message: `Su mesa ha sido reservada. Hora: ${this.hora}`,
        duration: 5000
      }).then(toast => toast.present());
    });
  }

  createHistReserva(mesaData: string) {
    this.auth.currentUserId().then(userId => {
      if (!userId) {
        // Handle the case where there is no user ID
        return;
      }
      this.auth.currentUser().then(user => {
        this.userService.getAddressUser(user.email).subscribe((users) => {
          console.log(users[0].email);
          this.reservaService.createHistReserva(mesaData, userId).then(data => {
            console.log("Se ha creado el objeto ", data);
          }).catch(e => {
            console.error("Ha habido un error " + e);
            this.toastService.showToast('Error al crear registro en historial');
          });
        }, error => {
          console.error("Ha habido un error " + error);
          this.toastService.showToast('Error al obtener la dirección del usuario');
        });
      });
    });
  }

}

