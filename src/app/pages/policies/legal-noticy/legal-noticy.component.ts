import { Component } from '@angular/core';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-legal-noticy',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './legal-noticy.component.html',
  styleUrl: '../policy.styles.sass'
})
export class LegalNoticyComponent {

}
