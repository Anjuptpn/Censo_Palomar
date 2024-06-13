import { Component } from '@angular/core';
import { PigeonFormComponent } from '../sections/pigeon-form/pigeon-form.component';

@Component({
  selector: 'app-pigeon-register',
  standalone: true,
  imports: [PigeonFormComponent],
  templateUrl: './pigeon-register.component.html',
  styleUrl: './pigeon-register.component.sass'
})
export class PigeonRegisterComponent {
  

}
