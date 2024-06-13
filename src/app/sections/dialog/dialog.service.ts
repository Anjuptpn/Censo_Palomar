import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogInterface } from './dialog.interface';
import { Observable } from 'rxjs';
import { DialogComponent } from './dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialogModal: MatDialog){}

  showDialog(dialogTitle: string, dialogMessage: string, cancelButtonDialog: string, 
                confirmButtonDialog: string): Observable<boolean>{
                  
    let data: DialogInterface = {title: dialogTitle, 
                                  message: dialogMessage, 
                                  cancelButton: cancelButtonDialog, 
                                  confirmButton: confirmButtonDialog};
    return this.dialogModal.open(DialogComponent, {data, width:'320px'}).afterClosed();
  }
}
