import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { HeaderFormsComponent } from '../sections/header-forms/header-forms.component';
import { UserInterface } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { FirebaseErrorsService } from '../../../services/firebase-errors.service';
import { SpinnerService } from '../../../services/spinner.service';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatCheckboxModule, 
                MatFormFieldModule, 
                MatButtonModule, 
                MatInput, 
                ReactiveFormsModule, 
                RouterLink,
                HeaderFormsComponent,
                FooterComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.sass'
})
export class SignupComponent implements OnInit{

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private snackbar = inject(SnackbarService);
  private firebaseErrors = inject(FirebaseErrorsService);
  private spinnerService = inject(SpinnerService);

  private readonly emailPattern =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  registerForm!: FormGroup;
  imageFile = new File([], "null.null"); //fichero vacío, no se permite que sea null
  inputImageError: boolean =  false;
  fileTypesPermited = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  ngOnInit(): void {
    this.inicializeForm();
  }

  private inicializeForm() :void{
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, 
                  //Validators.email, //este validador no funciona muy bien. 
                  Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      name: [ '', Validators.required],
      club: [''],
      urlImage:[''],
      policy: ['', [Validators.required, Validators.requiredTrue]]
    });
  }

  async submitSignupUser(){
    if (this.registerForm.valid){
      try{
        this.spinnerService.showLoading();      
        const userData: UserInterface = this.registerForm.value;
        await this.authService.userSignup(this.imageFile, userData);
        this.registerForm.reset();
        this.spinnerService.stopLoading();
      } catch (error){ 
        this.spinnerService.stopLoading();
        this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                                    'cerrar',
                                    8,
                                    'snackbar-error');          
      }
    } else {
      this.snackbar.showSnackBar("Hay campos obligatorios vacíos.<br>Revisa bien los campos obligatorios",
                                    'cerrar',
                                    8,
                                    'snackbar-error');
    }
  }

  getFileForm ($event: any): void{
    let extension = $event.target.files[0].name as string;
    extension = extension.slice(extension.lastIndexOf('.'));
    if (this.fileTypesPermited.includes(extension.toLowerCase())){
      this.imageFile = $event.target.files[0];
      this.inputImageError = false;
    } else {
      this.inputImageError = true;
    }
  } 
}
