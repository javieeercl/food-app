import { MenuController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';

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
  public isLoggedIn: boolean = false



  constructor(private router: Router, public auth: AuthService, private navCtrl: NavController, private menuCtrl: MenuController, public orderService: OrderService) {
    this.showInfoUser = false;
    this.showNewAccount = false;
    this.showOrder = false;
    this.showReserva = false;
    this.showGarzon = false;
    this.showPerfil = false;

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

  ngOnInit() {}

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
