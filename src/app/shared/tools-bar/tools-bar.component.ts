import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CompetitionsService } from '../../pages/user/competitions/competitions.service';
import { SnackbarService } from '../../services/snackbar.service';
import { FirebaseErrorsService } from '../../services/firebase-errors.service';
import { DialogService } from '../dialog/dialog.service';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { PigeonsService } from '../../pages/user/pigeons/pigeons.service';

@Component({
  selector: 'app-tools-bar',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './tools-bar.component.html',
  styleUrl: './tools-bar.component.sass'
})
export class ToolsBarComponent {
  @Input() itemId!: string;
  @Input() path!: string;
  @Input() competitionId!: string;
  currentUser: User | null = null; 

  constructor(private location: Location,
              private competitionsService: CompetitionsService,
              private snackbar: SnackbarService,
              private firebaseErrors: FirebaseErrorsService,
              private dialogService: DialogService,
              private authService: AuthService,
              private pigeonService: PigeonsService){
    this.authService.currentUserState.subscribe( (user) => {
      this.currentUser = user as User;
    });
   }

  goBack(): void{
    this.location.back()
  }

  async deleteItem(){
    if (this.isValid()){
      if(this.path === '/user/edit-competition/') {
        if (this.competitionId != null || this.competitionId != undefined){  
          try{
            await this.competitionsService.deleteCompetition(this.currentUser!.uid, this.itemId, this.competitionId);
            this.snackbar.showSnackBar("Se ha borrado la competición", 'cerrar', 12, 'snackbar-error');
            this.goBack();
          }catch (error){
            this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                                        'cerrar', 12, 'snackbar-error');
          }    
        } else {
          this.snackbar.showSnackBar("No se ha seleccionado ninguna competición, vuelve hacia atrás e inténtalo de nuevo", 'cerrar', 12, 'snackbar-error');
        }

      } else if (this.path === '/user/edit-pigeon/'){
        try{
          await this.pigeonService.deletePigeon(this.currentUser!.uid, this.itemId);
          this.snackbar.showSnackBar("Se ha borrado la paloma", 'cerrar', 12, 'snackbar-error');
          this.goBack();
        }catch (error){
          this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                                      'cerrar', 12, 'snackbar-error');
        } 
      }
    }
  }

  isValid(){
    if (this.path == null || this.path == undefined){
      this.snackbar.showSnackBar("No hay ruta asociada, vuelve hacia atrás e inténtalo de nuevo", 'cerrar', 12, 'snackbar-error');
      return false;
    }
    if (this.itemId == null || this.itemId == undefined){
      this.snackbar.showSnackBar("No se ha seleccionado ninguna paloma, vuelve hacia atrás e inténtalo de nuevo", 'cerrar', 12, 'snackbar-error');
      return false;
    }
    if (this.currentUser == null || this.currentUser == undefined){
      this.snackbar.showSnackBar("Es necesario iniciar sesión", 'cerrar', 12, 'snackbar-error');
      return false;
    }
    return true;
  } 

  openModal(item: string){
    const dialog = this.dialogService.showDialog('Eliminar '+item, `¿Está seguro de que quiere eliminar esta ${item}?`, 'Cancelar', 'Aceptar').subscribe( (res) => {
      res ? this.deleteItem() : '';      
      dialog.unsubscribe();
    })
    
    
  }

}
