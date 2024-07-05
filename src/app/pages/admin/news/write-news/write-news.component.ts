import { Component } from '@angular/core';
import { FormNewsComponent } from '../../sections/form-news/form-news.component';

@Component({
  selector: 'app-write-news',
  standalone: true,
  imports: [FormNewsComponent],
  template: 
  `<h3 class="title-h3">Añadir Noticia</h3>
   <app-form-news [typeForm]="'Publicar Noticia'"></app-form-news>       `,
  styles: `.title-h3
              text-align: center`
})
export class WriteNewsComponent {

}
