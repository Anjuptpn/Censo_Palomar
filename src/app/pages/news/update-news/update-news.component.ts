import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormNewsComponent } from '../sections/form-news/form-news.component';

@Component({
  selector: 'app-update-news',
  standalone: true,
  imports: [FormNewsComponent],
  template: 
  `<h3 class="title-h3">Actualizar Noticia</h3>
   <app-form-news [typeForm]="'Actualizar Noticia'" [newsId]="newsId"></app-form-news>       `,
  styles: `.title-h3
              text-align: center`
})
export class UpdateNewsComponent implements OnInit{

  constructor(private activatedRoute: ActivatedRoute) { }

  newsId = '';

  ngOnInit(): void {
    this.newsId = this.activatedRoute.snapshot.params['id'];
  }
}
