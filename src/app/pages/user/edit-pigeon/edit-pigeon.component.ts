import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PigeonFormComponent } from '../sections/pigeon-form/pigeon-form.component';

@Component({
  selector: 'app-edit-pigeon',
  standalone: true,
  imports: [PigeonFormComponent],
  templateUrl: './edit-pigeon.component.html',
  styleUrl: './edit-pigeon.component.sass'
})
export class EditPigeonComponent implements OnInit{

  private activedRoute = inject(ActivatedRoute);

  id: string = '';

  ngOnInit(): void {
    this.id = this.activedRoute.snapshot.params['id'];
  }

}
