import { Component } from '@angular/core';
import { BrowserQRCodeReader } from '@zxing/library';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-solicitar-garzon',
  templateUrl: './solicitar-garzon.page.html',
  styleUrls: ['./solicitar-garzon.page.scss'],
})
export class SolicitarGarzonPage {
  constructor(private toastController: ToastController) {}

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
