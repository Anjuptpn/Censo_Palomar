import { Component } from '@angular/core';

import * as enlacesDelMenu from '../menu/variables-menu';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.sass'
})
export class FooterComponent {

  menuLinks = enlacesDelMenu.menuLinks;

}
