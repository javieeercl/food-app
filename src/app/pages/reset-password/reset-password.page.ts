import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { InteractionService } from 'src/app/services/interaction.service';

const checkPasswords: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const password = group.get('password')?.value
  const confirmPassword = group.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { notEqual: true};
};

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {

  form: FormGroup;
  oobCode: string | null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private interaction: InteractionService
    ) {
      this.form = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      }, {validators: checkPasswords});

      this.oobCode = this.route.snapshot.queryParamMap.get('oobCode');

      if(!this.oobCode){
        this.router.navigate(['/categories']);
      } else {

      }
      this.form.reset();
    }

    get password(){
      return this.form.get('password');
    }

    get confirmPassword(){
      return this.form.get('confirmPassword');
    }

    async onSubmit(){
      if(this.form.valid && this.oobCode){
        const res = await this.interaction.presentAlert('Cambiar Contraseña', '¿Desea guardar los cambios?', 'No', 'Si');
        if(res){
          await this.interaction.showLoading('Modificando...');
          const { password } = this.form.value;

          await this.auth.passwordReset(password, this.oobCode).then((response) => {
            this.interaction.closeLoading();
            this.interaction.presentToast('Contraseña modificada con exito');
            this.form.reset();
            this.router.navigate(['/publico/login']);
          }).catch(err => {

            this.interaction.closeLoading();

          });
        }
      } else {
        this.interaction.presentAlert('Formulario inválido', 'Datos incorrectos o incompletos', '', 'Ok');
      }
    }
}
