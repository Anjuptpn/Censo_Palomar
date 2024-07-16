import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

import * as enlacesDelMenu from './variables-menu';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.sass',
})
export class MenuComponent implements OnInit, OnDestroy{

  @Output() closeSidenavEvent = new EventEmitter<boolean>();
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  userStates: String[] = ["All"];
  authsubscription: any; 

  menuLinks = enlacesDelMenu.menuLinks;

  ngOnInit(): void {
    this.authsubscription = this.authService.currentUserState.subscribe( user => {
      this.userStates = ["All"]
      if (user != null){
        this.userStates.push('logged');
        this.authService.isAdminUser(user).then( isAdmin => {
          if (isAdmin) this.userStates.push('Admin');
        });
      } else {
        this.userStates.push('notLogged');
      }
    });
  }

  emitCloseSidenav() :void{
    this.closeSidenavEvent.emit(false);
  }

  async logout(): Promise<void>{    
    await this.authService.logout();
    this.emitCloseSidenav();
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    this.authsubscription.unsubscribe();
  }



  
}
