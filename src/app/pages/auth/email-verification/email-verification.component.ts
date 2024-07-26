import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { filter, tap } from 'rxjs';
import { User } from '@angular/fire/auth';
import { SnackbarService } from '../../../services/snackbar.service';
import { FirebaseErrorsService } from '../../../services/firebase-errors.service';
import { SpinnerService } from '../../../services/spinner.service';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.sass'
})
export class EmailVerificationComponent {

  private authService = inject(AuthService);
  private snackbar = inject(SnackbarService);
  private firebaseErrors = inject(FirebaseErrorsService);
  private spinnerService = inject(SpinnerService);

  usuario: User | null = null;

  constructor(){
    this.authService.currentUserState.pipe(
      filter ((authState) => authState !== null),
      tap ((user) => (this.usuario = user)),
    ).subscribe();
  }

  async resendMail(){
    if (this.usuario){
      try{
        this.spinnerService.showLoading();
        await this.authService.sendVerificationEmail(this.usuario);
        this.snackbar.showSnackBar('Correo Enviado, revisa tu buzón de correo', 'Cerrar', 8, 'snackbar-success');
        this.spinnerService.stopLoading();
      } catch (error){
        this.spinnerService.stopLoading();
        this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                                    'cerrar',
                                    8,
                                    'snackbar-error');
      }
    }
  }

}
