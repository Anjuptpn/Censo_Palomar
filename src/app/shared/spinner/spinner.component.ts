import { Component, inject } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `@if(isSpinnerActive | async){
              <div class="wrapper-loading">
                  <div class="pulso center-child">
                    <img src="/assets/logo-blanco-cuadro.png" alt="Cargando">
                    <span style="--i:1"></span>
                    <span style="--i:2"></span>
                    <span style="--i:3"></span>
                    <span style="--i:4"></span>

                </div>
              </div>
            }`,
  styleUrl: './spinner.component.sass'
})
export class SpinnerComponent {

  private spinnerService = inject(SpinnerService);  
  isSpinnerActive = this.spinnerService.isSpinnerActive;
}
