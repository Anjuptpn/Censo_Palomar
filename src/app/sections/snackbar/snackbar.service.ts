import { Injectable, inject } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService { 

  private snackBar = inject(MatSnackBar);

  showSnackBar(message: string, button: string, time: number, className: string){
    return this.snackBar.open(message, button, {'duration': time*1000, panelClass: ['custom-snackbar', className],});
  }
}
