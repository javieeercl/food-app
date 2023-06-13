import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  historialPedidos: any[] = [];
  direccion: string = '';
  configuracion: any = {};
  favoritos: any[] = [];


  constructor() { 
// Obtén los datos del usuario y asigna los valores a las propiedades correspondientes
  this.historialPedidos = []; // Obtén los pedidos del usuario desde el servicio o almacenamiento
  this.direccion = ''; // Obtén la dirección del usuario desde el servicio o almacenamiento
  this.configuracion = {}; // Obtén la configuración del usuario desde el servicio o almacenamiento
  this.favoritos = []; // Obtén los favoritos del usuario desde el servicio o almacenamiento

  }

  ngOnInit() {

    this.actualizarDatosUsuario();
  }

  actualizarDatosUsuario() {
    // Lógica para obtener y asignar los datos del usuario a las propiedades correspondientes
    this.historialPedidos = []; // Obtén los pedidos del usuario desde el servicio o almacenamiento
    this.direccion = ''; // Obtén la dirección del usuario desde el servicio o almacenamiento
    this.configuracion = {}; // Obtén la configuración del usuario desde el servicio o almacenamiento
    this.favoritos = []; // Obtén los favoritos del usuario desde el servicio o almacenamiento
  }
}
