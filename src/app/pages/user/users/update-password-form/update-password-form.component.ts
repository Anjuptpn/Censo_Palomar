import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../services/auth.service';
import { SnackbarService } from '../../../../shared/snackbar/snackbar.service';
import { FirebaseErrorsService } from '../../../../services/firebase-errors.service';
import { User } from '@angular/fire/auth';
import { Location } from '@angular/common';
import { SpinnerService } from '../../../../services/spinner.service';



@Component({
  selector: 'app-update-password-form',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './update-password-form.component.html',
  styleUrl: './update-password-form.component.sass'
})
export class UpdatePasswordFormComponent {

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);
  private readonly firebaseErrors = inject(FirebaseErrorsService);
  private readonly location = inject(Location);
  private readonly spinnerService = inject(SpinnerService);

  passwordForm!: FormGroup;
  currentsubscription: any;
  currentUser: User | null = null;
  areEquals: boolean = true;

  constructor(){
    this.initializeForm();
    this.currentsubscription = this.authService.currentUserState
      .subscribe( (user) => {
        this.currentUser = user as User;
    });
  }
  private initializeForm(): void{
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', Validators.required],
    })
  }
  

  async submitPasswordForm(){
    this.spinnerService.showLoading();
    if (this.passwordForm.valid){
      this.checkEquals();
      if (this.areEquals){
        try{
          if (this.currentUser != null){
            const isChanged = await this.authService.changePassword(this.passwordForm.value.oldPassword,
              this.passwordForm.value.newPassword, this.currentUser);
              if (isChanged){
                this.snackbar.showSnackBar(
                  `La contraseña ha sido actualizada`, 'cerrar', 8, 'snackbar-success');
              } else {
                this.snackbar.showSnackBar(
                  `Error`,
                  'cerrar', 8, 'snackbar-error');
              }
          } else {
            this.snackbar.showSnackBar(
              `Debes tener la sesión iniciada para poder cambiar la contraseña`, 'cerrar', 8, 'snackbar-error');
          }          
        }catch (error){
          if (error === 'auth/invalid-credential'){
            this.spinnerService.stopLoading();
            this.snackbar.showSnackBar(
              `La contraseña actual no es correcta \nIngrese la contraseña correcta.`, 'cerrar', 8, 'snackbar-error');
          }else {
            this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                                'cerrar',  8,  'snackbar-error');
          }
        }   
      } else {
        this.snackbar.showSnackBar(
          `La nueva contraseña no coincide con la confirmación de la contraseña. Asegúrate de poner la misma`,
          'cerrar', 8, 'snackbar-error');
      }
    } else {
      this.snackbar.showSnackBar(
        `Hay campos obligatorios vacíos o incorrectos. \n Revisa bien los campos obligatorios`,
        'cerrar', 8, 'snackbar-error');
    }
    this.spinnerService.stopLoading();
  }

  private async updateUserData(){
    try{
      this.snackbar.showSnackBar("Se ha actualizado corretamente la información", 'cerrar', 8, 'snackbar-success');
      this.goBack();
    }catch (error){
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                          'cerrar',  8,  'snackbar-error');
    }
  }

  goBack(): void{
    this.location.back()
  }

  checkEquals(){
    this.areEquals = this.passwordForm.value.newPassword === this.passwordForm.value.repeatPassword ? true : false;
  }

  ngOnDestroy(): void {
    this.currentsubscription.unsubscribe();
  }


}
