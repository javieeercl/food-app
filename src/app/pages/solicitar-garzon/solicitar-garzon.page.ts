import { Component } from '@angular/core';
import { BrowserQRCodeReader } from '@zxing/library';
import { ToastController } from '@ionic/angular';
import { SolicitarGarzonService } from 'src/app/services/solicitar-garzon.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-solicitar-garzon',
  templateUrl: './solicitar-garzon.page.html',
  styleUrls: ['./solicitar-garzon.page.scss'],
})
export class SolicitarGarzonPage {

  intentos = {
    count: 0,
    timestamp: null
  };

  tiempoRestante = null;
  timerId = null;

  constructor(private toastController: ToastController, private solGarzon: SolicitarGarzonService, private auth: AuthService) {}

  async obtenerID(){
    let currentUserId = await this.auth.currentUserId();  // Obtener el ID del usuario actual
    console.log(currentUserId);
  }

  async contador() {
    const now = Date.now();
    const tiempoMinimo = this.intentos.count < 2 ? 3 * 60 * 1000 : 5 * 60 * 1000; // 3 or 5 minutes in milliseconds

    if (this.intentos.timestamp && now - this.intentos.timestamp < tiempoMinimo) {
      const tiempoRestanteMs = tiempoMinimo - (now - this.intentos.timestamp);
      this.tiempoRestante = Math.ceil(tiempoRestanteMs / 1000); // Convert to seconds

      // Start countdown
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.tiempoRestante--;
        if (this.tiempoRestante <= 0) {
          clearInterval(this.timerId);
          this.timerId = null;
          this.tiempoRestante = null;
        }
      }, 1000);
      await this.mostrarToast('Debes esperar ' + this.tiempoRestante + ' segundos antes de intentar de nuevo', 5000);
      return false; // No se puede realizar un nuevo intento
    }

    // If no Toast is shown, return a resolved promise
    this.intentos.count++; // Increment the count of attempts
    this.intentos.timestamp = now; // Update the timestamp of the last attempt
    return true; // Se puede realizar un nuevo intento
  }


  async escanearQR() {
    try {

      const videoElement = document.getElementById('videoElement') as HTMLVideoElement;
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoElement.srcObject = stream;
      videoElement.play();

      const codeReader = new BrowserQRCodeReader();
      const result = await codeReader.decodeFromVideoElement(videoElement);

      const puedeIntentar = await this.contador();

      const nMesa = result.getText();

      videoElement.pause();
      videoElement.srcObject = null;
      stream.getTracks().forEach(track => track.stop());

      if (puedeIntentar) {
        let nuevaSolicitud = {
          mesa: nMesa
        };

        const path = 'solicitudes';
        const idUser = await this.auth.currentUserId();  // Obtener el ID del usuario actual
        const peticion = 'Peticiones Usuario';

        this.solGarzon.crearNotificacion(path, idUser, peticion, nuevaSolicitud);
        await this.mostrarToast('El garzón está en camino a la mesa ' + nMesa, 5000);
      }

    } catch (error) {
      console.error(error);
      await this.mostrarToast('Error al escanear el código QR' + error.message, 5000);
    }
  }

  async mostrarToast(message: string, duration: number) {
    const toast = await this.toastController.create({
      message,
      duration
    });
    toast.present();
  }
}
