import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../pages/auth/services/auth.service';
import { SnackbarService } from '../sections/snackbar/snackbar.service';

export const notLoggedGuard = () => {
  const authService = inject(AuthService);
  const snackbar = inject(SnackbarService);
  const router = inject(Router);
  return authService.isUserLogged().subscribe(
    (value) => { 
      if(!value){
        return true;
      } else {
        snackbar.showSnackBar('Ya tienes la sesión iniciada','cerrar',8, 'snackbar-error');
        router.navigate(['/user/pigeon-list']);
        return false;
      }
    });  
}
