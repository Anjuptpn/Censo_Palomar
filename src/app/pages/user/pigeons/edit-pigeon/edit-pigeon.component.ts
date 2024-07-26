import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PigeonFormComponent } from '../sections/pigeon-form/pigeon-form.component';

@Component({
  selector: 'app-edit-pigeon',
  standalone: true,
  imports: [PigeonFormComponent],
  template: `
  <div class="wrapper-title-edit-pigeon center-child">
    <div class="title-edit-pigeon">
        <h2 class="title-form">Editar Paloma</h2>
    </div>
  </div>
  <app-pigeon-form [typeForm]="'Editar Paloma'" [pigeonId]="id"></app-pigeon-form>
  `,
  styles: ``
})
export class EditPigeonComponent implements OnInit{

  private activedRoute = inject(ActivatedRoute);

  id: string = '';

  ngOnInit(): void {
    this.id = this.activedRoute.snapshot.params['id'];
  }

}
