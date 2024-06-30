import { Component, Input, inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { MatIconModule } from '@angular/material/icon';
import { FirebaseService } from '../../../../../services-shared/firebase.service';
import { CompetitionInterface } from '../../../../../models/competition.model';
import { SnackbarService } from '../../../../../sections/snackbar/snackbar.service';
import { FirebaseErrorsService } from '../../../../auth/services/firebase-errors.service';
import { AuthService } from '../../../../auth/services/auth.service';
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

  mockCompetitions = [
    {
      "ranking": "105",
      "competitionName":"Suelta Puerto Calero",
      "competitionPlace":"Puerto Calero (Lanzarote)",
      "competitionType": "Velocidad",
      "competitonDate": "24/09/2020",
      "competitionTime": "08:30",
      "arriveDate": "24/09/2020",
      "arriveTime": "16:30",
      "distance": "876541",
      "speed": "1458.99",
      "points": "340",
      "id": "328684762384.029374019273409.ranking",
    },
    {
      "ranking": "105",
      "competitionName":"Suelta Social",
      "competitionPlace":"Sardina del norte",
      "competitionType": "Velocidad",
      "competitonDate": "22/04/2021",
      "competitionTime": "08:36",
      "arriveDate": "22/04/2021",
      "arriveTime": "09:30",
      "distance": "80",
      "speed": "1458.99",
      "points": "120",
      "id": "3223424762384.0293742432429.ranking",
    },
    {
      "ranking": "40",
      "competitionName":"Campeonato de Canarias",
      "competitionPlace":"Alta Mar",
      "competitionType": "Gran Fondo",
      "competitonDate": "04/03/2022",
      "competitionTime": "08:00",
      "arriveDate": "04/03/2022",
      "arriveTime": "20:37",
      "distance": "900",
      "speed": "1258.99",
      "points": "560",
      "id": "3223424762384.0293742432429.ranking",
    }
  ];

}
