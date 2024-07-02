import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { CompetitionsListComponent } from '../../competitions/sections/competitions-list/competitions-list.component';
import { ToolsBarComponent } from '../../../../sections/tools-bar/tools-bar.component';
import { FirebaseService } from '../../../../services-shared/firebase.service';
import { AuthService } from '../../../auth/services/auth.service';
import { FirebaseErrorsService } from '../../../auth/services/firebase-errors.service';
import { SnackbarService } from '../../../../sections/snackbar/snackbar.service';
import { PigeonInterface } from '../../../../models/pigeon.model';
import { PigeonsService } from '../pigeons.service';

@Component({
  selector: 'app-pigeon-profile',
  standalone: true,
  imports: [MatIconModule, CommonModule, CompetitionsListComponent, ToolsBarComponent],
  templateUrl: './pigeon-profile.component.html',
  styleUrl: './pigeon-profile.component.sass'
})
export class PigeonProfileComponent implements OnInit, OnDestroy{

  private activedRoute = inject(ActivatedRoute);
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);
  private firebaseErrorsService = inject(FirebaseErrorsService);
  private snackbar = inject(SnackbarService);
  private pigeonService = inject(PigeonsService);

  id: string = '';
  currentUser: User | null = null;
  currentPigeon: PigeonInterface | null = null;
  currentSubscribe: any; 

  ngOnInit(): void {
    this.id = this.activedRoute.snapshot.params['id'];
    this.currentSubscribe = this.authService.currentUserState.subscribe( (user) => {
      this.currentUser = user as User;
      this.getPigeonWithId(user?.uid as string);
    });
  }

  // getPigeonWithId(userId: string){
  //   try{
  //     const path = 'usuarios/'+userId+'/palomas';
  //     this.firebaseService.getDocumentFromFirebase(this.id, path).then( response => {
  //       this.currentPigeon = response.data() as PigeonInterface;
  //       this.pigeonService.saveImageURL(this.currentPigeon.image);
  //     });
  //   }catch (error){
  //     this.snackbar.showSnackBar(this.firebaseErrorsService.translateErrorCode(error as string), 
  //                                     'cerrar', 8, 'snackbar-error');
  //   }
  // }

  async getPigeonWithId(userId: string){
    try{
      if (userId == null || userId == undefined || userId == ''){
        this.snackbar.showSnackBar("Debes estar registrado para ver la información de una paloma", 'cerrar', 12, 'snackbar-error');
      } else if (this.id == null || this.id == undefined || this.id == ''){
        this.snackbar.showSnackBar("No hay seleccionada ninguna paloma, vuelve hacia atrás y reinténtalo.", 'cerrar', 12, 'snackbar-error');
      } else {
        this.currentPigeon = await this.pigeonService.getPigeonwithId(userId, this.id) as PigeonInterface;
      }
    }catch (error){
       this.snackbar.showSnackBar(this.firebaseErrorsService.translateErrorCode(error as string), 
                                        'cerrar', 8, 'snackbar-error');
    }
  }

  ngOnDestroy(): void {
    this.currentSubscribe.unsubscribe();
  }

}
