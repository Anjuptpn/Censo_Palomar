import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../../services-shared/firebase.service';
import { PigeonInterface } from '../../../models/pigeon.model';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '@angular/fire/auth';
import { FirebaseErrorsService } from '../../auth/services/firebase-errors.service';
import { SnackbarService } from '../../../sections/snackbar/snackbar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pigeon-profile',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './pigeon-profile.component.html',
  styleUrl: './pigeon-profile.component.sass'
})
export class PigeonProfileComponent implements OnInit{

  private activedRoute = inject(ActivatedRoute);
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);
  private firebaseErrorsService = inject(FirebaseErrorsService);
  private snackbar = inject(SnackbarService);

  id: string = '';
  currentUser: User | null = null;
  currentPigeon: PigeonInterface | null = null;

  ngOnInit(): void {
    this.id = this.activedRoute.snapshot.params['id'];
    this.authService.currentUserState.subscribe( (user) => {
      this.currentUser = user as User;
      this.getPigeonWithId(user?.uid as string);
    });
  }

  getPigeonWithId(userId: string){
    try{
      const path = 'usuarios/'+userId+'/palomas';
      this.firebaseService.getDocumentFromFirebase(this.id, path).then( response =>
        this.currentPigeon = response.data() as PigeonInterface
      );
    }catch (error){
      this.snackbar.showSnackBar(this.firebaseErrorsService.translateErrorCode(error as string), 
                                      'cerrar', 8, 'snackbar-error');
    }
  }

  

}
