import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MenuComponent } from '../menu/menu.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, RouterOutlet, MatSidenavModule, MenuComponent ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass'
})
export class HeaderComponent {

  logoImg = '/assets/logo-blanco-cuadro.png';
  appName = "CENSO PALOMAR";

  openMenu: boolean = false;

  openSideNav(value: boolean){
    this.openMenu = value;  
  }

  toggleSideNav() {
    this.openMenu = !this.openMenu; 
  }

}
