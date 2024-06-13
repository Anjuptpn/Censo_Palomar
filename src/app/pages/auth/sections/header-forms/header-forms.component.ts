import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-forms',
  standalone: true,
  imports: [],
  templateUrl: './header-forms.component.html',
  styleUrl: './header-forms.component.sass'
})
export class HeaderFormsComponent {
  @Input() webName!: string;
  @Input() titleForm!: string; 

}
