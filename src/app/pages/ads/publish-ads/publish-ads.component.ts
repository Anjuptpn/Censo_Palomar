import { Component } from '@angular/core';
import { FormAdsComponent } from '../sections/form-ads/form-ads.component';

@Component({
  selector: 'app-publish-ads',
  standalone: true,
  imports: [FormAdsComponent],
  template: 
  `<h3 class="title-h3">Publicar Anuncio</h3>
   <app-form-ads [typeForm]="'Publicar Anuncio'"></app-form-ads>       `,
  styles: `.title-h3
              text-align: center`,
})
export class PublishAdsComponent {

}
