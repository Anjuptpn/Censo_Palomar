import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseErrorsServicesService {

  translateErrorCode (code: string){
    let message: string = '';

    switch (code){
      case 'auth/wrong-password':
        message = 'Las credenciales aportadas son incorrectas';
        break;
      case 'auth/network-request-failed':
        message = 'Por favor, verifica tu conexión de Internet';
        break;
      case 'auth/too-many-requests':
        message =
          'Se están produciendo demasiadas solicitudes, Espere un poco y vuélvelo a intentar';
        break;
      case 'auth/user-disabled':
        message =
          'Tu cuenta ha sido deshabilitada';
        break;
      case 'auth/requires-recent-login':
        message = 'Por favor, vuelve a iniciar sesión';
        break;
      case 'auth/email-already-in-use':
        message = 'Esta dirección de email ya está siendo utilizada';
        break;
      case 'auth/user-not-found':
        message =
          'No existe usuario con esas credenciales';
        break;
      case 'auth/invalid-email  ':
        message = 'El email usado no es un';
        break;
      case 'auth/cannot-delete-own-user-account':
        message = 'No puedes borrar tu cuenta de usuario. Contacta con un administrador';
        break;
       default:
        message = 'Ha ocurrido un error, por favor, inténtelo de nuevo más tarde';
        break;
    }

    return message;

  }
}
