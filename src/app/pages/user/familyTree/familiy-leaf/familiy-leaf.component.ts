import { Component, Input } from '@angular/core';
import { PigeonInterface } from '../../../../models/pigeon.model';

@Component({
  selector: 'app-familiy-leaf',
  standalone: true,
  imports: [],
  templateUrl: './familiy-leaf.component.html',
  styleUrl: './familiy-leaf.component.sass'
})
export class FamiliyLeafComponent {
  @Input() pigeon!: any;

  isString(value: any): boolean{
    return typeof value === 'string';
  }


}
