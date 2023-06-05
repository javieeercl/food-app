import { TranslateService } from '@ngx-translate/core';
import { ToastService } from './../../services/toast.service';
import { Component, Input, Output, OnInit, EventEmitter  } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() showBack: boolean = true;
  @Output () newAccount: EventEmitter<boolean>;
  @Output () back: EventEmitter<boolean>;
  @Output () doLogin: EventEmitter<boolean>;
  isForgot:boolean;

  public user: User;
  constructor(private auth: AuthService,
    private toast: ToastService,
    private translate: TranslateService,
    private interaction: InteractionService,
    private router: Router) {
    this.newAccount = new EventEmitter<boolean>();
    this.back = new EventEmitter<boolean>();
    this.doLogin = new EventEmitter<boolean>();
    this.user = new User({});
  }

  ngOnInit() {
    this.isForgot=false;
  }

  login(){
    this.auth.login(this.user.email, this.user.password).then((result) => {
      console.log(result);
      this.toast.showToast(this.translate.instant('label.login.success'));
      this.doLogin.emit(true);
    }).catch(error => {
      console.log(error);
      this.toast.showToast(this.translate.instant('label.login.error'));
    })
  }

  async requestPassword(){
    if(this.user && this.user.email){
      const res = await this.interaction.presentAlert('Enviando Correo', 'Te enviaremos un correo de recuperación', '', 'Ok');
        if (res) {
          await this.interaction.showLoading('Enviando...');
          await this.auth.requestPassword(this.user.email).then(() => {
            this.isForgot = false;
            this.user.email = '';
            this.interaction.closeLoading();
            this.interaction.presentToast('Correo de recuperación enviado con exito');
            this.router.navigate(['/categories']);
          }).catch(err => {
            this.interaction.closeLoading();
          });
        }
    }  else {
      this.interaction.presentAlert('Formulario inválido', 'Datos incorrectos o incompletos', '', 'Ok');
    }
  }

  forgotPassword(option: Number){
      try {
        if (option == 1) {
           this.isForgot = true;
        } else {
          this.requestPassword();
        }
      } catch (error) {
        console.log('catch',error)
      }
  }

  showNewAccount(){
    this.newAccount.emit(true);
  }

  backLogin(){
    this.isForgot =false;
  }

  exit(){
    this.back.emit(true);
  }

}
