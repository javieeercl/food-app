import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';
import { Globalization } from '@ionic-native/globalization/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat'
import { environment } from 'src/environments/environment';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';
// import { PayPal } from '@ionic-native/paypal/ngx';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { ServiceWorkerModule } from '@angular/service-worker';


export function HttpLoaderFactory(http: HttpClient){
  return new TranslateHttpLoader(http, "/assets/i18n/", ".json")
}

// firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(),
            AppRoutingModule,
            HttpClientModule,
            SharedModule,
            TranslateModule.forRoot({
              loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
              }
            }),
            AngularFireModule.initializeApp(environment.firebase),
            ServiceWorkerModule.register('ngsw-worker.js', {
              enabled: !isDevMode(),
              // Register the ServiceWorker as soon as the application is stable
              // or after 30 seconds (whichever comes first).
              registrationStrategy: 'registerWhenStable:30000'
            })
          ],
  providers: [
    Globalization,
    NavParams,
    // PayPal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
