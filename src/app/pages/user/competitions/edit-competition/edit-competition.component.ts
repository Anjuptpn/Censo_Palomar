import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { User } from '@angular/fire/auth';
import { PigeonInterface } from '../../../../models/pigeon.model';
import { CompetitionFormComponent } from '../sections/competition-form/competition-form.component';

@Component({
  selector: 'app-edit-competition',
  standalone: true,
  imports: [CompetitionFormComponent],
  templateUrl: './edit-competition.component.html',
  styles: ``,
})
export class EditCompetitionComponent implements OnInit{

  private readonly activedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  pigeonId: string = '';
  competitionId: string = '';
  currentUser: User | null = null;
  currentPigeon: PigeonInterface | null = null;

  ngOnInit(): void {
    this.pigeonId = this.activedRoute.snapshot.params['pigeonId'];
    this.competitionId = this.activedRoute.snapshot.params['competitionId'];
    this.authService.currentUserState.subscribe( (user) => {
      this.currentUser = user as User;
    });
  }

  

}
