import { Component, OnInit, inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { CompetitionInterface } from '../../../../models/competition.model';
import { SnackbarService } from '../../../../sections/snackbar/snackbar.service';
import { FirebaseErrorsService } from '../../../auth/services/firebase-errors.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { ToolsBarComponent } from '../../../../sections/tools-bar/tools-bar.component';
import { CommonModule } from '@angular/common';
import { DatesService } from '../../../../services-shared/dates.service';
import { CompetitionsService } from '../competitions.service';

@Component({
  selector: 'app-view-competition',
  standalone: true,
  imports: [MatIconModule, ToolsBarComponent, CommonModule],
  templateUrl: './view-competition.component.html',
  styleUrl: './view-competition.component.sass'
})
export class ViewCompetitionComponent implements OnInit{

  private activedRoute = inject(ActivatedRoute);
  private snackbar = inject(SnackbarService);
  private firebaseErrorsService = inject(FirebaseErrorsService);  
  private competitionsService = inject(CompetitionsService);
  private authService = inject(AuthService);
  private datesService = inject (DatesService);

  competitionId: string = '';
  pigeonId: string = '';
  currentUser: User | null = null;
  currentCompetition:  CompetitionInterface | null = null;

  ngOnInit(): void {
    this.pigeonId = this.activedRoute.snapshot.params['pigeonId'];
    this.competitionId = this.activedRoute.snapshot.params['competitionId'];
    this.authService.currentUserState.subscribe( (user) => {
      this.currentUser = user as User;
      this.getCompetition(user?.uid as string);
    });
  }

  async getCompetition(userId: string){
    try{
      if (userId == null || userId == undefined || userId == ''){
        this.snackbar.showSnackBar("Debes estar registrado para editar una competición", 'cerrar', 12, 'snackbar-error');
      } else {
        this.currentCompetition = await this.competitionsService.getCompetitionWithId(userId, this.pigeonId, this.competitionId) as CompetitionInterface;
      }
    }catch (error){
      this.snackbar.showSnackBar(this.firebaseErrorsService.translateErrorCode(error as string), 
                                      'cerrar', 8, 'snackbar-error');
    }
  }

  convertMinutes(minutes: number | null | undefined){
    if(minutes == null || minutes == undefined){
      return null;
    }
    return this.datesService.convertirSegundosAHorasMinutosYSegundos(minutes);
  }

}
