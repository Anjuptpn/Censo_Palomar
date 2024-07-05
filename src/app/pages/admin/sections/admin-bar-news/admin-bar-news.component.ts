import { Component, inject, Input } from '@angular/core';
import { NewsService } from '../../../news/news.service';
import { SnackbarService } from '../../../../sections/snackbar/snackbar.service';
import { FirebaseErrorsService } from '../../../auth/services/firebase-errors.service';
import { DialogService } from '../../../../sections/dialog/dialog.service';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-bar-news',
  standalone: true,
  imports: [RouterLink],
  template: `<div class="container-bar">
  <a [routerLink]="['/admin/update-news', newsId]">Editar Esta Noticia</a>
  <a [routerLink]="['/admin/write-news']">Añadir nueva noticia</a>
  <a (click)="deleteNews()">Borrar esta Noticia</a>
  <a href="#">Panel de Administrador</a>
</div>`,
  styleUrl: './admin-bar-news.component.sass'
})
export class AdminBarNewsComponent {
  @Input() newsId?: string | null;  

  private readonly newsService = inject(NewsService);
  private readonly snackbar = inject (SnackbarService);
  private readonly firebaseErrors = inject(FirebaseErrorsService);
  private readonly dialogService = inject(DialogService);
  private location = inject(Location);

  async deleteNews(){
    if (this.newsId == null || this.newsId == undefined){
        this.snackbar.showSnackBar("No se ha seleccionado ninguna noticia, vuelve hacia atrás e inténtalo de nuevo", 'cerrar', 12, 'snackbar-error');
    } else {
      try{
        await this.newsService.deleteNews(this.newsId);
        this.snackbar.showSnackBar("Se ha borrado la noticia", 'cerrar', 12, 'snackbar-error');
        this.location.back();

      }catch (error){
        this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                                    'cerrar', 12, 'snackbar-error');
      } 
    }
  }


  openModal(item: string){
    const dialog = this.dialogService.showDialog('Eliminar noticia', `¿Está seguro de que quiere eliminar esta Noticia?`, 'Cancelar', 'Aceptar').subscribe( (res) => {
      res ? this.deleteNews() : '';      
      dialog.unsubscribe();
    })
    
    
  }



  


}
