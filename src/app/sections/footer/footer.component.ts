import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import * as enlacesDelMenu from '../menu/variables-menu';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../pages/auth/services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.sass'
})
export class FooterComponent implements OnInit, OnDestroy{

  private authService = inject(AuthService);
  menuLinks = enlacesDelMenu.menuLinks;
  authsubscription: any;
  isLogged = false;

  ngOnInit(): void {
    this.authsubscription = this.authService.currentUserState.subscribe( user => {
      if (user != null){        
        this.isLogged = true;
      } else {
        this.isLogged = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.authsubscription.unsubscribe();
  }

}
