import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

import * as enlacesDelMenu from './variables-menu';
import { AuthService } from '../../pages/auth/services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.sass',
})
export class MenuComponent {

  @Output() closeSidenavEvent = new EventEmitter<boolean>();
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  menuLinks = enlacesDelMenu.menuLinks;

  emitCloseSidenav() :void{
    this.closeSidenavEvent.emit(false);
  }

  async logout(): Promise<void>{
    await this.authService.logout();
    this.emitCloseSidenav();
    this.router.navigate(['']);
  }

  
}
