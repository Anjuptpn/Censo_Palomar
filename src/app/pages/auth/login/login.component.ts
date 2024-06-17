import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HeaderFormsComponent } from '../sections/header-forms/header-forms.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { SnackbarService } from '../../../sections/snackbar/snackbar.service';
import { FirebaseErrorsService } from '../services/firebase-errors.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, RouterLink, ReactiveFormsModule, HeaderFormsComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent implements OnInit{

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private snackbar = inject(SnackbarService);
  private firebaseErrors = inject(FirebaseErrorsService);

  usuario$! : Observable<any>;

  loginForm!: FormGroup;
  private readonly emailPattern =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // patrón descubierto en: https://gist.github.com/CliffCrerar/8e4da6885dd20d0a1c011d2c10a965c2?permalink_comment_id=3020592

  ngOnInit(): void {
    this.inicializeForm();
      
  }

  inicializeForm(){
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]], //Validators.email no funciona muy bien
      password: ['', [Validators.required]]
    });
  }

  async initSesionWithEmail(){
    try{
      await this.authService.loginWithEmailAndPassword(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value);
    }
    catch (error){
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                                    'cerrar',
                                    8,
                                    'snackbar-error');
    }
  }

}
