import { TranslateService } from '@ngx-translate/core';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { LoadingController, NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  public categories: Category[] = [];
  private loading: HTMLIonLoadingElement | undefined;

  constructor(private productService: ProductService, private loadingCtrl: LoadingController, private translateService: TranslateService,
    private navParams: NavParams, private navCtrl: NavController) {

  }

  ngOnInit() {
    this.loadData();
  }

  goToProducts(id: number){
    this.navParams.data['idCategory'] = id;
    this.navCtrl.navigateForward('list-products');
  }

  loadData(){
    this.showLoading().then(() => {
      this.productService.getCategories().subscribe(results => {
        this.categories = results;
        console.log(this.categories);
        this.dismissLoading();
      }, error => {
        console.error(error);
        this.dismissLoading();
      })
    });
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
