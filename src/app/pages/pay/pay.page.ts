import { TranslateService } from '@ngx-translate/core';
import { ToastService } from './../../services/toast.service';
// import { PayPal, PayPalConfiguration, PayPalPayment } from '@ionic-native/paypal/ngx';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.page.html',
  styleUrls: ['./pay.page.scss'],
})
export class PayPage implements OnInit {

  public showNewAccount: boolean;

  constructor(
    public auth: AuthService,
    public orderService: OrderService,
    // private paypal: PayPal,
    private userService: UserService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {
    this.showNewAccount = false;
  }

  ngOnInit() {
  }

  createOrder() {

        // Check if the order is allowed at the current time
    // if (!this.orderService.isOrderAllowed()) {
    //   console.error("No se pueden realizar compras entre las 00:00 y las 11:59");
    //   this.toastService.showToast(this.translate.instant('No se pueden realizar compras entre las 00:00 y las 11:59'))
    //   return;
    // }

    this.auth.currentUserId().then(userId => {
      if (!userId) {
        // Handle the case where there is no user ID
        return;
      }
      this.auth.currentUser().then(user => {
        this.userService.getAddressUser(user.email).subscribe((users) => {
          console.log(users[0].address);
          this.orderService.order.address = users[0].address;
          this.orderService.order.user = users[0].email;
          this.orderService.createOrder().then( data => {
            console.log("Se ha creado el objeto ", data);

            // Now we can use userId here
            // Pass the converted order to createHistOrder
            this.orderService.createHistOrder(this.orderService.convertOrder(), userId);

            this.toastService.showToast(this.translate.instant('label.pay.success', { address: this.orderService.order.address }))
            this.orderService.clearOrder();
          }).catch(e => {
            console.error("Ha habido un error " + e)
            this.toastService.showToast(this.translate.instant('label.pay.fail'))
          })

        })
      })

    })
  }

  newAccount() {
    this.showNewAccount = true;
  }

  back() {
    this.showNewAccount = false;
  }

}
