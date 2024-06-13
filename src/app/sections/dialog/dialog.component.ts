import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DialogInterface } from './dialog.interface';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.sass'
})
export class DialogComponent {

  constructor(@Inject (MAT_DIALOG_DATA) public dialogFields: DialogInterface){ }


}
