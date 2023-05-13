import { TranslateService } from '@ngx-translate/core';
import { ToastService } from './../../services/toast.service';
// import { PayPal, PayPalConfiguration, PayPalPayment } from '@ionic-native/paypal/ngx';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

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

    this.auth.currentUser().then(user => {
      this.userService.getAddressUser(user.email).subscribe((users) => {
        console.log(users[0].address);
        this.orderService.order.address = users[0].address;
        this.orderService.order.user = users[0].email;

        this.orderService.createOrder().then( data => {
          console.log("Se ha creado el objeto ", data);

          this.toastService.showToast(this.translate.instant('label.pay.success', { address: this.orderService.order.address }))
          this.orderService.clearOrder();
        }).catch(e => {
          console.error("Ha habido un error " + e)
          this.toastService.showToast(this.translate.instant('label.pay.fail'))
        })
        // this.createOrder();
      })
    })

  }


  // payWithPaypal() {

  //   // Cambiar los ids de sandbox y live por los vuestros
  //   this.paypal.init({
  //     PayPalEnvironmentProduction: 'AYJNIDc3oqbSK6rREfimKdeOgdk0LHUdtWbIcxKvJMTjJKdQJ0xrwiw1oOiiTMv5nGHyUQHhSeMbLpEh',
  //       PayPalEnvironmentSandbox: 'ATdxfpdt5pou5ZkpeU6THsrS8lna6rF0_TIvjD-sGsQSBz5ObavU0ETH_oBIoWG9k2zIfJsOV7-i_A13'
  //   }).then(() => {
  //     // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
  //     this.paypal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
  //       // Only needed if you get an "Internal Service Error" after PayPal login!
  //       payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
  //     })).then(() => {
  //       let payment = new PayPalPayment(this.orderService.totalOrder(), 'USD', 'FoodAPP', 'sale');
  //       this.paypal.renderSinglePaymentUI(payment).then(() => {

  //         this.auth.currentUser().then(user => {
  //           this.userService.getAddressUser(user.email).subscribe((users) => {
  //             console.log(users[0].address);
  //             this.orderService.order.address = users[0].address;
  //             this.createOrder();
  //           })
  //         })

  //       }, () => {
  //         // Error or render dialog closed without being successful
  //       });
  //     }, () => {
  //       // Error in configuration
  //     });
  //   }, () => {
  //     // Error in initialization, maybe PayPal isn't supported or something else
  //   });

  // }

  newAccount() {
    this.showNewAccount = true;
  }

  back() {
    this.showNewAccount = false;
  }

}
