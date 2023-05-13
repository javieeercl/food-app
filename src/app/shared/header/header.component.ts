import { forEach } from 'lodash-es';
import { MenuController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
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


  constructor(private router: Router, public auth: AuthService, private navCtrl: NavController, private menuCtrl: MenuController, public orderService: OrderService) {
    this.showInfoUser = false;
    this.showNewAccount = false;
    this.showOrder = false;

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
    this.auth.logout();
  }

  goBack(){
    this.navCtrl.back();
  }

  back(){
    this.showInfoUser = false;
    this.showNewAccount = false;
    this.showOrder = false;
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

  goToPay(){
    this.back();
    this.orderService.order.productsOrder.forEach(p => p.showDetail = false)
    this.menuCtrl.close('content')
    this.navCtrl.navigateForward('pay');
  }
}
