import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../auth/services/auth.service';
import { SnackbarService } from '../../../../sections/snackbar/snackbar.service';
import { FirebaseErrorsService } from '../../../auth/services/firebase-errors.service';
import { User } from '@angular/fire/auth';
import { filter, tap } from 'rxjs';
import { UserInterface } from '../../../../models/user.model';
import { Location } from '@angular/common';
import { UpdatePasswordFormComponent } from '../update-password-form/update-password-form.component';
import { SpinnerService } from '../../../../services-shared/spinner.service';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, UpdatePasswordFormComponent],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.sass'
})
export class UpdateUserComponent {

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);
  private readonly firebaseErrors = inject(FirebaseErrorsService);
  private readonly location = inject(Location);
  private spinnerService = inject(SpinnerService);

  userForm!: FormGroup;
  imageFile = new File([], "null.null");
  currentsubscription: any;
  currentUser: User | null = null;
  currentUserData: UserInterface | null = null;

  constructor(){
    this.initializeForm();
    this.currentsubscription = this.authService.currentUserState.pipe(
      filter((authState) => authState != null),
      tap((user) => this.currentUser = user as User))
      .subscribe( (res) => {
        if (res && this.currentUser){
          this.spinnerService.showLoading();
          this.authService.getUserInfoFromFirebase(this.currentUser.uid).then(
            data => {
              this.currentUserData = data;
              this.patchForm(data);
            });
            this.spinnerService.stopLoading();
        }
    });
  }
  private initializeForm(): void{
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: {value: '', disabled: true},
      club: [''],
      image: [''],
    })
  }

  getFileForm($event: any): void{
    this.imageFile = $event.target.files[0];
  }

  submitUpdateUser(){
    if (this.userForm.valid){
      this.prepareFormData().then(userData =>
        this.updateUserData(userData)).
        catch( error => {
          this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                             'cerrar',  8,  'snackbar-error');
        });
    } else {
      this.snackbar.showSnackBar(
        `Hay campos obligatorios vacíos o incorrectos. \n Revisa bien los campos obligatorios`,
        'cerrar', 8, 'snackbar-error');
    }
  }

  private patchForm(data: UserInterface): void{
    const formData = {
      name: data.name,
      email: data.email,
      club: data.club,
      image: '',
    }
    this.userForm.patchValue(formData);
  }  

  async prepareFormData(): Promise<UserInterface>{
    this.spinnerService.showLoading();
    let user: UserInterface = this.userForm.value;
    if(this.imageFile.name === 'null.null'){
      user.urlImage = this.currentUserData!.urlImage;
    } else {
      try{
        await this.authService.deleteUserImage(this.currentUserData!.urlImage);
        user.urlImage = await this.authService.uploadUserImageToFirestore(this.imageFile, 'perfiles-usuarios');
        this.spinnerService.stopLoading();
      } catch (error){
        this.spinnerService.stopLoading();
        this.snackbar.showSnackBar(
          `Han Ocurrido un error al subir las imágenes al servidor`,
          'cerrar', 8, 'snackbar-error');
      }
    }     
    user.registerDate = this.currentUserData!.registerDate;
    user.rol = this.currentUserData!.rol;
    user.password = this.currentUserData!.password;
    user.id = this.currentUserData!.id;
    user.email = this.currentUserData!.email;
    return user;
  }

  private async updateUserData(userData: UserInterface){
    this.spinnerService.showLoading();
    try{
      await this.authService.updateUserData(userData);
      this.snackbar.showSnackBar("Se ha actualizado corretamente la información", 'cerrar', 8, 'snackbar-success');
      this.goBack();
      this.spinnerService.stopLoading();
    }catch (error){
      this.spinnerService.stopLoading();
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                          'cerrar',  8,  'snackbar-error');
    }
  }

  goBack(): void{
    this.location.back()
  }

  ngOnDestroy(): void {
    this.currentsubscription.unsubscribe();
  }

  
 


}
