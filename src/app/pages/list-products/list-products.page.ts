import { TranslateService } from '@ngx-translate/core';
import { ProductService } from './../../services/product.service';
import { NavParams, LoadingController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.page.html',
  styleUrls: ['./list-products.page.scss'],
})
export class ListProductsPage implements OnInit {

  private idCategory: number;
  public products: Product[] = [];
  private loading: HTMLIonLoadingElement | undefined;

  constructor(private navParams: NavParams, private productService: ProductService, private loadingCtrl: LoadingController, private translateService: TranslateService, private navCtrl: NavController) {
    this.idCategory = this.navParams.data['idCategory'];
    console.log(this.idCategory);

  }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.showLoading().then(() => {
      this.productService.getProducts(this.idCategory).subscribe(results => {
        this.products = results;
        console.log(this.products);
        this.dismissLoading();
      }, error => {
        console.error(error);
        this.dismissLoading();
      })
    });
  }

  goToProduct(p: Product){
    this.navParams.data['product'] = p;
    this.navCtrl.navigateForward('product');
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: this.translateService.instant('label.loading'),
      cssClass: 'custom-loading'
    });

    await this.loading.present();
  }

  async dismissLoading(){
    if (this.loading != null) {
      await this.loading.dismiss();
    }
  }

}
