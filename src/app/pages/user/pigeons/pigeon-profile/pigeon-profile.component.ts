import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { CompetitionsListComponent } from '../../competitions/sections/competitions-list/competitions-list.component';
import { ToolsBarComponent } from '../../../../shared/tools-bar/tools-bar.component';
import { AuthService } from '../../../../services/auth.service';
import { FirebaseErrorsService } from '../../../../services/firebase-errors.service';
import { SnackbarService } from '../../../../shared/snackbar/snackbar.service';
import { PigeonInterface } from '../../../../models/pigeon.model';
import { PigeonsService } from '../pigeons.service';
import { MatButton } from '@angular/material/button';
import { SpinnerService } from '../../../../services/spinner.service';

@Component({
  selector: 'app-pigeon-profile',
  standalone: true,
  imports: [MatIconModule, CommonModule, CompetitionsListComponent, ToolsBarComponent, RouterLink, MatButton],
  templateUrl: './pigeon-profile.component.html',
  styleUrl: './pigeon-profile.component.sass'
})
export class PigeonProfileComponent implements OnInit, OnDestroy{

  private activedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private firebaseErrorsService = inject(FirebaseErrorsService);
  private snackbar = inject(SnackbarService);
  private pigeonService = inject(PigeonsService);
  private spinnerService = inject(SpinnerService);

  id: string = '';
  currentUser: User | null = null;
  currentPigeon: PigeonInterface | null = null;
  currentSubscribe: any; 
  routeSubscribe: any;

  ngOnInit(): void {
    this.spinnerService.showLoading();
    this.routeSubscribe = this.activedRoute.params.subscribe( (id) => {
      const pathId = this.activedRoute.snapshot.paramMap.get('id');
      if (null == pathId) return;
      this.id = pathId;
      if (this.currentUser != null || this.currentUser != undefined) this.getPigeonWithId(this.currentUser.uid);
    });
    this.currentSubscribe = this.authService.currentUserState.subscribe( (user) => {
      this.currentUser = user as User;
      this.getPigeonWithId(user?.uid as string);
      
    });
  }

  async getPigeonWithId(userId: string){
    try{
      this.spinnerService.showLoading();
      if (userId == null || userId == undefined || userId == ''){
        this.snackbar.showSnackBar("Debes estar registrado para ver la información de una paloma", 'cerrar', 12, 'snackbar-error');
      } else if (this.id == null || this.id == undefined || this.id == ''){
        this.snackbar.showSnackBar("No hay seleccionada ninguna paloma, vuelve hacia atrás y reinténtalo.", 'cerrar', 12, 'snackbar-error');
      } else {
        this.currentPigeon = await this.pigeonService.getPigeonwithId(userId, this.id) as PigeonInterface;
      }
      this.spinnerService.stopLoading();
    }catch (error){
      this.spinnerService.stopLoading();
      this.snackbar.showSnackBar(this.firebaseErrorsService.translateErrorCode(error as string), 
                                        'cerrar', 8, 'snackbar-error');
    }
  }

  ngOnDestroy(): void {
    this.currentSubscribe.unsubscribe();
    this.routeSubscribe.unsubscribe();
  }

}
