import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '@angular/fire/auth';
import { PigeonInterface } from '../../../../models/pigeon.model';
import { CompetitionFormComponent } from '../sections/competition-form/competition-form.component';
import { SpinnerService } from '../../../../services-shared/spinner.service';

@Component({
  selector: 'app-add-competition',
  standalone: true,
  imports: [RouterLink, CompetitionFormComponent],
  templateUrl: './add-competition.component.html',
  styleUrl: './add-competition.component.sass'
})
export class AddCompetitionComponent implements OnInit{

  private activedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);

  id: string = '';
  currentUser: User | null = null;
  currentPigeon: PigeonInterface | null = null;

  ngOnInit(): void {
    this.id = this.activedRoute.snapshot.params['id'];
    this.authService.currentUserState.subscribe( (user) => {
      this.currentUser = user as User;
    });
  }

}
