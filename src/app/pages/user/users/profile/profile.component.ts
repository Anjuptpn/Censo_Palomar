import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '@angular/fire/auth';
import { UserInterface } from '../../../../models/user.model';
import { filter, tap } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SpinnerService } from '../../../../services-shared/spinner.service';
import { SnackbarService } from '../../../../sections/snackbar/snackbar.service';
import { FirebaseErrorsService } from '../../../auth/services/firebase-errors.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIcon, MatListModule, CommonModule, MatButtonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.sass'
})
export class ProfileComponent implements OnInit, OnDestroy{
  private readonly authService = inject(AuthService);
  private readonly spinnerService = inject(SpinnerService);
  private readonly snackbar = inject(SnackbarService);
  private readonly firebaseErrors = inject(FirebaseErrorsService);

  currentUser: User | null = null;
  currentUserData: UserInterface | null = null;
  currentSubscription: any;

  ngOnInit(): void {
    this.spinnerService.showLoading();
  this.currentSubscription = this.authService.currentUserState.pipe(
    filter((authState)=>authState != null),
    tap((user)=>(this.currentUser = user))
  ).subscribe(res => {
    if (res && this.currentUser){
      this.authService.getUserInfoFromFirebase(this.currentUser.uid).then(
        data => {
          this.currentUserData = data;
          this.spinnerService.stopLoading();
        }
      ).catch(error => {
        this.spinnerService.stopLoading();
        this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string), 
                                      'cerrar', 8, 'snackbar-error');
      })
    }
  })
 }
 
 ngOnDestroy(): void {
   this.currentSubscription.unsubscribe();
 }

}
