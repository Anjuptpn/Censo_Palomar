import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from '../../../../services/firebase.service';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../../../services/auth.service';
import { PigeonInterface } from '../../../../models/pigeon.model';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SnackbarService } from '../../../../services/snackbar.service';
import { FirebaseErrorsService } from '../../../../services/firebase-errors.service';
import { MatButtonModule } from '@angular/material/button';
import { SpinnerService } from '../../../../services/spinner.service';

@Component({
  selector: 'app-pigeon-list',
  standalone: true,
  imports: [MatIconModule, RouterLink, MatButtonModule],
  templateUrl: './pigeon-list.component.html',
  styleUrl: './pigeon-list.component.sass'
})
export class PigeonListComponent implements OnInit{
  private readonly firebaseService = inject(FirebaseService);
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);  
  private readonly firebaseErrors = inject(FirebaseErrorsService);
  private spinnerService = inject(SpinnerService);

  currentUser: User | null = null;
  pigeonList: PigeonInterface[] = [];  

  ngOnInit(): void {
    this.spinnerService.showLoading();
    this.authService.currentUserState.subscribe( (user) => {
      this.currentUser = user as User;
      this.getPigeonCollectionFromFirebase();
    }); 
  }

  getPigeonCollectionFromFirebase(){  
    try{
      this.spinnerService.showLoading();
      const path = 'usuarios/'+this.currentUser?.uid+'/palomas';
      this.firebaseService.getCollectionFromFirebase<PigeonInterface>(path).subscribe( pigeons => {
        this.pigeonList = pigeons;
        this.spinnerService.stopLoading();
      });
    } catch (error){
      this.spinnerService.stopLoading();
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                          'cerrar',  8,  'snackbar-error');
    }     
  }
}