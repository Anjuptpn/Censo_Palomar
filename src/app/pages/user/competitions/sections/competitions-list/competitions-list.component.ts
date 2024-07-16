import { Component, Input, inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { MatIconModule } from '@angular/material/icon';
import { FirebaseService } from '../../../../../services/firebase.service';
import { CompetitionInterface } from '../../../../../models/competition.model';
import { SnackbarService } from '../../../../../shared/snackbar/snackbar.service';
import { FirebaseErrorsService } from '../../../../../services/firebase-errors.service';
import { AuthService } from '../../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-competitions-list',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterLink],
  templateUrl: './competitions-list.component.html',
  styleUrl: './competitions-list.component.sass'
})
export class CompetitionsListComponent{
  @Input() pigeonId!: string;

  private firebaseService = inject(FirebaseService);
  private snackbar = inject(SnackbarService);
  private authService = inject(AuthService);
  private readonly firebaseErrors = inject(FirebaseErrorsService);
  competitionsList: CompetitionInterface[] = [];
  currentUser: User | null = null;

  constructor(){
    this.authService.currentUserState.subscribe( (user) => {
      this.currentUser = user as User;
      this.getPigeonCompetitionsFromFirebase(this.pigeonId);
    });
  }

  getPigeonCompetitionsFromFirebase(pigeonId: string){
    try{
      const path = 'usuarios/'+this.currentUser?.uid+'/palomas/'+pigeonId+'/competiciones';
      this.firebaseService.getCollectionFromFirebase<CompetitionInterface>(path).subscribe( competitions => {
        this.competitionsList = competitions;
      });
    } catch (error){
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                          'cerrar',  8,  'snackbar-error');
    }    

  }
}
