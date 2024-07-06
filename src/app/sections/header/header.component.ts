import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MenuComponent } from '../menu/menu.component';
import { AuthService } from '../../pages/auth/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, RouterOutlet, MatSidenavModule, 
              MenuComponent, CommonModule, SpinnerComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass'
})
export class HeaderComponent {

  private readonly authService = inject(AuthService);

  logoImg = '/assets/logo-blanco-cuadro.png';
  appName = "CENSO PALOMAR";

  Usuario$!: Observable<User | null>;

  openMenu: boolean = false;

  constructor(){
    this.Usuario$ = this.authService.currentUserState;

  }

  openSideNav(value: boolean){
    this.openMenu = value;  
  }

  toggleSideNav() {
    this.openMenu = !this.openMenu; 
  }

}
