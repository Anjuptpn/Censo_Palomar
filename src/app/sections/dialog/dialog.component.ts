import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DialogInterface } from './dialog.interface';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `<div class="header-dialog">
        <h2 mat-dialog-title>{{dialogFields.title}}</h2>
      </div>
      <mat-dialog-content>
        <p>{{dialogFields.message}}</p>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-flat-button color=warn [mat-dialog-close]="false">{{dialogFields.cancelButton}}</button>
        <button mat-flat-button color=primary [mat-dialog-close]="true">{{dialogFields.confirmButton}}</button>
      </mat-dialog-actions>`,
  styles: `
  @import '../../general-styles/css-variables'
  .header-dialog
      h2
          text-align: center
          color: $prussian-blue

  mat-dialog-content
      text-align: center
      p
          color: $lapiz-lazuli

  mat-dialog-actions
      display: flex
      justify-content: right
      margin-bottom: 10px
      margin-right: 10px
      button
          font-weight: 600`,
})
export class DialogComponent {

  constructor(@Inject (MAT_DIALOG_DATA) public dialogFields: DialogInterface){ }


}
