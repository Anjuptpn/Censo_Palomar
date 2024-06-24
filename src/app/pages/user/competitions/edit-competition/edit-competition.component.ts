import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '@angular/fire/auth';
import { PigeonInterface } from '../../../../models/pigeon.model';

@Component({
  selector: 'app-edit-competition',
  standalone: true,
  imports: [],
  templateUrl: './edit-competition.component.html',
  styleUrl: './edit-competition.component.sass'
})
export class EditCompetitionComponent implements OnInit{

  private activedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);

  pigeonId: string = '';
  competitionId: string = '';
  currentUser: User | null = null;
  currentPigeon: PigeonInterface | null = null;

  ngOnInit(): void {
    this.pigeonId = this.activedRoute.snapshot.params['pigeonId'];
    this.competitionId = this.activedRoute.snapshot.params['competitionId'];
    this.authService.currentUserState.subscribe( (user) => {
      this.currentUser = user as User;
      //this.getPigeonWithId(user?.uid as string);
    });
  }

}
