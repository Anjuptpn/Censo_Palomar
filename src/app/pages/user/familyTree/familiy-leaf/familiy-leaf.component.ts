import { Component, Input } from '@angular/core';
import { PigeonInterface } from '../../../../models/pigeon.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-familiy-leaf',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './familiy-leaf.component.html',
  styleUrl: './familiy-leaf.component.sass'
})
export class FamiliyLeafComponent {
  @Input() pigeon!: any;
  @Input() index!: number;

  isString(value: any): boolean{
    return typeof value === 'string';
  }

  getLevel(index: number): number{
    return Math.floor(Math.log2(index + 1))
   }


}
