import { Component } from '@angular/core';
import { PigeonFormComponent } from '../sections/pigeon-form/pigeon-form.component';

@Component({
  selector: 'app-pigeon-register',
  standalone: true,
  imports: [PigeonFormComponent],
  template: `
  <div class="wrapper-title-register center-child">
    <div class="title-register">
        <h2 class="title-form">Registrar Paloma</h2>
    </div>
  </div>
  <app-pigeon-form [typeForm]="'Registrar Paloma'"></app-pigeon-form>
  `,
  styles: ``
})
export class PigeonRegisterComponent {
  

}
