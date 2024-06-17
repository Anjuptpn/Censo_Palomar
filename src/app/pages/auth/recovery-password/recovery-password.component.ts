import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { HeaderFormsComponent } from '../sections/header-forms/header-forms.component';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../../../sections/snackbar/snackbar.service';
import { FirebaseErrorsService } from '../services/firebase-errors.service';

@Component({
  selector: 'app-recovery-password',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, RouterLink, ReactiveFormsModule, HeaderFormsComponent],
  templateUrl: './recovery-password.component.html',
  styleUrl: './recovery-password.component.sass'
})
export class RecoveryPasswordComponent {

  private readonly authService = inject(AuthService);
  private snackbar = inject(SnackbarService);
  private firebaseErrors = inject(FirebaseErrorsService);

  email!: FormControl;
  hasError = false;
  emailAlreadySent = false;
  private readonly emailPattern =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // patrón descubierto en: https://gist.github.com/CliffCrerar/8e4da6885dd20d0a1c011d2c10a965c2?permalink_comment_id=3020592

  ngOnInit(): void {
    this.inicializeForm();    
  }

  inicializeForm(): void{
    this.email = new FormControl ('', [Validators.required, Validators.pattern(this.emailPattern)]);
    
  }

  async sendRecoveyPassword(){
    //event.stopPropagation(); //evita que la página se recargue.
    try{
      await this.authService.sendLinkToRecoveryPassword(this.email.value);
      this.emailAlreadySent = true;
    } catch (error){
      this.emailAlreadySent = false;
      this.hasError = true;
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                                    'cerrar',
                                    8,
                                    'snackbar-error');

     }
    
  }

}
