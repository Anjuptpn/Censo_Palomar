import { Component, OnInit } from '@angular/core';
import { FormAdsComponent } from '../sections/form-ads/form-ads.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-ads',
  standalone: true,
  imports: [FormAdsComponent],
  template: 
  `<h3 class="title-h3">Actualizar Anuncio</h3>
   <app-form-ads [typeForm]="'Actualizar Anuncio'" [adsId]="adsId"></app-form-ads>       `,
  styles: `.title-h3
              text-align: center`,
})
export class EditAdsComponent implements OnInit{

  constructor(private activatedRoute: ActivatedRoute) { }

  adsId = '';

  ngOnInit(): void {
    this.adsId = this.activatedRoute.snapshot.params['id'];
  }

}
