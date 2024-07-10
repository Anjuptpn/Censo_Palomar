import { Component, inject } from '@angular/core';
import { SnackbarService } from '../../../sections/snackbar/snackbar.service';
import { SpinnerService } from '../../../services-shared/spinner.service';
import { AuthService } from '../../auth/services/auth.service';
import { AdsInterface } from '../../../models/ads.model';
import { User } from '@angular/fire/auth';
import { AdsService } from '../../ads/ads.service';
import { CommonModule, Location } from '@angular/common';
import { FirebaseErrorsService } from '../../auth/services/firebase-errors.service';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { DialogService } from '../../../sections/dialog/dialog.service';

@Component({
  selector: 'app-my-ads',
  standalone: true,
  imports: [CommonModule, MatButton, RouterLink, MatIcon],
  templateUrl: './my-ads.component.html',
  styleUrl: './my-ads.component.sass'
})
export class MyAdsComponent {

  private readonly authService = inject(AuthService);
  private readonly spinnerService = inject(SpinnerService);
  private readonly snackbar = inject(SnackbarService);
  private readonly adsService = inject(AdsService);
  private readonly location = inject(Location);
  private readonly firebaseErrors = inject(FirebaseErrorsService);
  private readonly dialogService = inject(DialogService);
  adsList: AdsInterface[] = [];
  currentUser: User | null = null; 
  userSubscribe: any;
  
  ngOnInit(): void {
    this.spinnerService.showLoading();
    this.userSubscribe = this.authService.currentUserState.subscribe((user) => {
      if (user != null){
        this.currentUser = user;
        this.getAds(user);
      }
      
    })
    
  }

  deleteAd(adsId: string, userId: string, imageUrl: string){
    try{
      this.spinnerService.showLoading();
      if (this.currentUser != null && this.currentUser != undefined){
        if(this.currentUser.uid === userId){
          this.adsService.deleteAd(adsId, imageUrl);
          this.snackbar.showSnackBar('Se ha eliminado correctamente el anuncio', 
                     'cerrar', 8, 'snackbar-error');
          this.deleteFromList(adsId);
        } else {
          this.snackbar.showSnackBar(`No tienes permiso para borrar este anuncio`, 
            'cerrar', 8, 'snackbar-error');
        }       
      } else {
        this.snackbar.showSnackBar(`Debes tener la sesión iniciada para poder borrar un anuncio`, 
                 'cerrar', 8, 'snackbar-error');
      }
    } catch (error){
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string), 
                 'cerrar', 8, 'snackbar-error');
    } finally{
      this.spinnerService.stopLoading();
    }
  }

  getAds(user: User){
    this.adsService.getUserAdsWithId(user.uid).then( list => {
      this.adsList = list;
    }).catch( error => {
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string), 
             'cerrar', 8, 'snackbar-error');
    }).finally(()=> this.spinnerService.stopLoading());
  }

  
  openModal(adsId: string, userId: string, imageUrl: string){
    const dialog = this.dialogService.showDialog('Eliminar Anuncio', `¿Está seguro de que quiere eliminar este Anuncio?`, 'Cancelar', 'Aceptar').subscribe( (res) => {
      res ? this.deleteAd(adsId, userId, imageUrl) : '';      
      dialog.unsubscribe();
    })
  }

  deleteFromList(adsId: string){
    const matchId = (item: AdsInterface) => item.id === adsId;
    this.adsList.splice(this.adsList.findIndex(matchId), 1);

  }

  ngOnDestroy(): void {
    this.userSubscribe.unsubscribe();
  }

  goBack(){
    this.location.back();
  }

}
