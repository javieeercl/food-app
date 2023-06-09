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
  constructor(private toastController: ToastController, private solGarzon: SolicitarGarzonService, private auth: AuthService) {}

  async obtenerID(){
    let currentUserId = await this.auth.currentUserId();  // Obtener el ID del usuario actual
    console.log(currentUserId);
  }


  async escanearQR() {
    try {
      const videoElement = document.getElementById('videoElement') as HTMLVideoElement;
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoElement.srcObject = stream;
      videoElement.play();

      const codeReader = new BrowserQRCodeReader();
      const result = await codeReader.decodeFromVideoElement(videoElement);

      const nMesa = result.getText();

      videoElement.pause();
      videoElement.srcObject = null;
      stream.getTracks().forEach(track => track.stop());

      this.mostrarToast('El garzón está en camino a la mesa' + nMesa);

      let nuevaSolicitud = {
        mesa: '1'
      };

      const path = 'solicitudes';
      const idUser = await this.auth.currentUserId();  // Obtener el ID del usuario actual
      const peticion = 'Peticiones Usuario';

      this.solGarzon.crearNotificacion(path, idUser, peticion, nuevaSolicitud);

    } catch (error) {
      console.error(error);
      this.mostrarToast('Error al escanear el código QR');
    }
  }


  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }
}
