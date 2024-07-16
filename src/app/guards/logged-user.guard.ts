import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../shared/snackbar/snackbar.service';
import { map } from 'rxjs';

export const loggedUserGuard = () => {
  const authService = inject(AuthService);
  const snackbar = inject(SnackbarService);
  const router = inject(Router);  
  return authService.currentUserState.pipe( 
    map( (user) => {
    if (user != null){      
      if(authService.isMailVerificated(user)){
        return true;
      } else {
        snackbar.showSnackBar('Debes verificar tu email para acceder','cerrar',8, 'snackbar-error');
        router.navigate(['/auth/email-verification']);  
        return false;
      }
    } else {
      snackbar.showSnackBar('Debes iniciar sesión para acceder','cerrar',8, 'snackbar-error');
      router.navigate(['/auth/login']);
      return false;
    }
  })); 
  
}
