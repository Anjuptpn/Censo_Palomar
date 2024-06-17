import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '@angular/fire/auth';
import { UserInterface } from '../../../Models/user.model';
import { filter, tap } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIcon, MatListModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.sass'
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);

  currentUser: User | null = null;
  currentUserData: UserInterface | null = null;

 constructor () {
    this.authService.currentUserState.pipe(
      filter((authState)=>authState != null),
      tap((user)=>(this.currentUser = user))
    ).subscribe(res => {
      if (res && this.currentUser){
        this.authService.getUserInfoFromFirebase(this.currentUser.uid).then(
          data => {
            this.currentUserData = data;
          }
        )
      }
    })
 }  

}
