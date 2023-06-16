import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class SolicitarGarzonService {

constructor(private fdb: AngularFireDatabase) {

}

crearNotificacion(nombreLista:string, idUser: string, peticion: string, data: any){
  const ref = this.fdb.list(`${nombreLista}/${idUser}/${peticion}`);
  return ref.push(data);
}

}
