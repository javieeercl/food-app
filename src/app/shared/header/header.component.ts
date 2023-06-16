import { UserService } from 'src/app/services/user.service';
import { MenuController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  public showInfoUser: boolean;
  public showNewAccount: boolean;
  public showOrder: boolean;
  public showReserva: boolean;
  public showGarzon: boolean;
  public showPerfil: boolean;
  public isLoggedIn: boolean = false;
  public showReporte: boolean = false;
  public userEmail: string;
  public userRol: string;



  constructor(private fdb: AngularFireDatabase ,private afAuth: AngularFireAuth,private router: Router, public auth: AuthService, private navCtrl: NavController, private menuCtrl: MenuController, public orderService: OrderService) {
    this.showInfoUser = false;
    this.showNewAccount = false;
    this.showOrder = false;
    this.showReserva = false;
    this.showGarzon = false;
    this.showPerfil = false;
    this.showReporte = false;
    this.userEmail = '';
    this.userRol = '';
  }

  async cargarNombre() {
    const user = this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        this.userEmail = user.email;

        // Obtener el rol del usuario desde Firebase Realtime Database
        const userId = user.uid;
        const userRole = await this.getUserRole(userId);

        // Asignar el rol al usuario
        this.userRol = userRole;
        console.log(this.userRol);

      } else {
        console.log('No hay usuario autenticado');
      }
    });
  }

  getUserRole(userId: string): Promise<string> {
    return this.fdb
      .object(`users/${userId}/role`)
      .valueChanges()
      .pipe(
        take(1),
        map((role: string) => role as string) // Asegura el tipo de dato como string
      )
      .toPromise();
  }



  goToReservarMesa() {
    this.router.navigate(['/reservar-mesa']);
    this.menuCtrl.close('content');
  }

  goToSolicitarGarzon() {
    this.router.navigate(['/solicitar-garzon']);
    this.menuCtrl.close('content');
  }
  goToPerfil() {
    this.router.navigate(['/perfil']);
    this.menuCtrl.close('content');
  }

  goToReportes() {
    this.router.navigate(['/reportes']);
    this.menuCtrl.close('content');
  }

  ngOnInit() {
    this.cargarNombre();

  }

  showBackButton(){
    let urlNoButton = [
      '/categories',
      '/pay'
    ]

    if (urlNoButton.find(url => url === this.router.url)) {
      return false;
    }
    return true;
  }

  showPanelUser(){
    this.showInfoUser = true;
  }

  logout(){
    this.isLoggedIn = false;
    this.userEmail = '';
    this.auth.logout();
  }

  goBack(){
    this.navCtrl.back();
  }

  back(){
    this.showInfoUser = false;
    this.showNewAccount = false;
    this.showOrder = false;
    this.showReserva = false;
    this.showGarzon = false;
    this.showReporte = false;
  }

  newAccount(){
    this.showNewAccount = true;
  }

  showLogin(){
    this.showNewAccount = false;
  }

  showPanelOrder(){
    this.showOrder = true;
  }

  showPanelReserva(){
    this.showReserva = true;
  }

  showPanelGarzon(){
    this.showGarzon = true;
  }
  showPanelPerfil(){
    this.showPerfil = true;
  }

  showPanelReporte(){
    this.showReporte = true;
  }

  goToPay(){
    this.back();
    this.orderService.order.productsOrder.forEach(p => p.showDetail = false)
    this.menuCtrl.close('content')
    this.navCtrl.navigateForward('pay');
  }
  login() {
    // Lógica para iniciar sesión
    this.isLoggedIn = true; // Establecer isLoggedIn en verdadero después de iniciar sesión exitosamente
  }



}
