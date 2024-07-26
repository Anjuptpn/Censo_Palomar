import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const snackbar = inject(SnackbarService);
  const router = inject(Router);
  return authService.isUserLogged().subscribe(
    (value) => { 
      if(value){
        return true;
      } else {
        snackbar.showSnackBar('Debes iniciar sesión para acceder','cerrar',8, 'snackbar-error');
        router.navigate(['/auth/login']);
        return false;
      }
    });  
}


