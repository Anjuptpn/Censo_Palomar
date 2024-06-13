import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import * as enlacesDelMenu from './variables-menu';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.sass',
})
export class MenuComponent {

  @Output() closeSidenavEvent = new EventEmitter<boolean>();

  menuLinks = enlacesDelMenu.menuLinks;

  emitCloseSidenav() :void{
    this.closeSidenavEvent.emit(false);
  }

  
}
