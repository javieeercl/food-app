import { UserService } from './../../services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from './../../services/toast.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserCredential } from 'firebase/auth';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {

  @Output () back: EventEmitter<boolean>;
  @Output () doCreateAccount: EventEmitter<boolean>;

  public user: User;

  constructor(private auth: AuthService,
    private toast: ToastService,
    private translate: TranslateService,
    private userService: UserService) {
    this.user = new User({});
    this.back = new EventEmitter<boolean>();
    this.doCreateAccount = new EventEmitter<boolean>();
   }

  ngOnInit() {
  }

  createAccount() {
    this.auth.createAccount(this.user.email, this.user.password).then((result: UserCredential) => {
      console.log(result);
      this.user.uid = result.user.uid; // Set the uid from the result as the id of the user
      this.userService.addUser(this.user);
      this.doCreateAccount.emit(true);
      this.toast.showToast(this.translate.instant('label.create.account.success'));
    }).catch(error => {
      this.toast.showToast(this.translate.instant('label.create.account.error'));
    })
  }

  exit(){
    this.back.emit(true);
  }

}
