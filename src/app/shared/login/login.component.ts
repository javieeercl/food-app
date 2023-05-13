import { TranslateService } from '@ngx-translate/core';
import { ToastService } from './../../services/toast.service';
import { Component, Input, Output, OnInit, EventEmitter  } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input() showBack: boolean = true;
  @Output () newAccount: EventEmitter<boolean>;
  @Output () back: EventEmitter<boolean>;
  @Output () doLogin: EventEmitter<boolean>;

  public user: User;

  constructor(private auth: AuthService,
    private toast: ToastService,
    private translate: TranslateService) {
    this.newAccount = new EventEmitter<boolean>();
    this.back = new EventEmitter<boolean>();
    this.doLogin = new EventEmitter<boolean>();
    this.user = new User({});
  }

  ngOnInit() {
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

  showNewAccount(){
    this.newAccount.emit(true);
  }

  exit(){
    this.back.emit(true);
  }

}
