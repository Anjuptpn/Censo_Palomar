import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { map, take, tap, from, switchMap, of } from 'rxjs';

export const onlyAdminGuard = () => {
  const authService = inject(AuthService);
  const snackbar = inject(SnackbarService);
  const router = inject(Router); 

  //es necesario usar switchmap para cancelar la emisión del anterior observable, no basta con map 
  //que sigue enviando un Observable <Observable <boolean>> y para homogeneizar la salida se transforma la 
  //promesa con observable "Operador From" y "Operador of".
  //DOCUMENTACIÓN: https://www.rxjs.es/operadores/creation/from
  // https://www.rxjs.es/operadores/transformation/map
  // https://www.rxjs.es/operadores/transformation/switchmap
  //https://puntotech.github.io/rxjs-docu/operators/transformation/switchMap
  // https://stackoverflow.com/questions/47317019/canactivate-converting-observableobservableboolean-to-observableboolean
  return authService.currentUserState.pipe(
    switchMap((user) => {
      if (user !== null){
        return from (authService.isAdminUser(user)).pipe(
          map( (isAdmin) => {
            if (isAdmin){
              return true;
            }else{
              snackbar.showSnackBar('No tienes permiso para acceder','cerrar',8, 'snackbar-error');
              router.navigate(['/user/pigeon-list']);
              return false;
            }
          })
        )
      } else {
        snackbar.showSnackBar('Debes iniciar sesión para acceder','cerrar',8, 'snackbar-error');
        router.navigate(['/auth/login']);
        return of(false);
      }
    })
  );
}

 


