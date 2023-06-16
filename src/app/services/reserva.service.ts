import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { getDatabase, ref, push } from "firebase/database";
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  constructor(private fdb: AngularFireDatabase) {

  }
  createHistReserva(mesaData:string, userId: string) {
    const db = getDatabase();

    // Get the current month and year
    const monthYear = moment().format('MMYYYY');

    // Include the month and year in the reference path
    const histReservaRef = ref(db, `histReserva/${userId}/${monthYear}`);

    return push(histReservaRef, mesaData);
  }
}
