import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';

@Injectable({
  providedIn: 'root'
})
export class SolicitarGarzonService {

  constructor(private fdb: AngularFireDatabase, private afMessaging: AngularFireMessaging) {}

  crearNotificacion(nombreLista: string, idUser: string, peticion: string, data: any) {
    const ref = this.fdb.list(`${nombreLista}/${idUser}/${peticion}`);
    return ref.push(data);
  }

  enviarNotificacion(idUser: string, titulo: string, cuerpo: string) {
    this.afMessaging.requestToken.subscribe(
      (token) => {
        const notification = {
          to: token,
          notification: {
            title: titulo,
            body: cuerpo
          }
        };
  
        // Envía la notificación al servidor de FCM
        // utilizando el token y los datos de la notificación.
      },
      (error) => {
        console.error('Error al obtener el token de FCM:', error);
      }
    );
  }
}