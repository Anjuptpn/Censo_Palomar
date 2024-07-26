import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SnackbarService } from '../../../../services/snackbar.service';
import { Location } from '@angular/common';
import { FirebaseErrorsService } from '../../../../services/firebase-errors.service';
import { MatInputModule } from '@angular/material/input';
import { NewsInterface } from '../../../../models/news.models';
import { NewsService } from '../../../news/news.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-form-news',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './form-news.component.html',
  styleUrl: './form-news.component.sass'
})
export class FormNewsComponent implements OnInit{
  @Input() typeForm!: string;
  @Input() newsId?: string | null;

  private readonly formBuilder = inject(FormBuilder);
  private readonly snackbar = inject(SnackbarService);
  private readonly location = inject(Location);
  private readonly firebaseErrors = inject(FirebaseErrorsService);
  private readonly newsService = inject(NewsService);

  imageFile = new File([], "null.null");
  inputImageError: boolean =  false;
  fileTypesPermited = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  newsForm!: FormGroup;
  currentNews: NewsInterface | null = null;

  ngOnInit(): void {
    this.inicializeNewsForm();
    if (this.typeForm === "Actualizar Noticia"){
      this.getNewsToEdit();
    }    
  }

  private inicializeNewsForm (): void{
    this.newsForm = this.formBuilder.group({
      title: ['', Validators.required],
      category: [''],      
      body: [''],
      image: [''],
    });       
  }

  private async getNewsToEdit(): Promise<void>{
    try{
      if (this.newsId == null || this.newsId == undefined || this.newsId == ''){
        this.snackbar.showSnackBar("No hay seleccionada ninguna noticia, vuelve hacia atrás y reinténtalo.", 'cerrar', 12, 'snackbar-error');
      } else {
        this.currentNews = await this.newsService.getNewsWithId(this.newsId);
        this.patchValueToForm(this.currentNews);
      }
    } catch (error){
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string), 
                                       'cerrar', 8, 'snackbar-error');
    }
  }

  async submitNews(): Promise<void>{
    if(this.newsForm.valid){      
      this.prepareFormData().then(news => {
        if (this.typeForm === "Actualizar Noticia"){
          this.updateNews(news);
        } else {
          this.publishNews(news);
        }        
      }).catch(error => {
        this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                             'cerrar',  8,  'snackbar-error');
      });
    } else {
      this.snackbar.showSnackBar(`Hay campos obligatorios vacíos o incorrectos. \n Revisa bien los campos`,
        'cerrar',  8, 'snackbar-error');
    }
  }

  private async prepareFormData(): Promise<NewsInterface>{
    let news: NewsInterface = this.newsForm.value as NewsInterface;
    if (this.typeForm === "Actualizar Noticia" && this.imageFile.name === 'null.null' && this.currentNews != null){
      news.image = this.currentNews!.image;
    } else {
      if (this.typeForm === "Actualizar Noticia" && this.currentNews != null){
        this.newsService.deleteNewsImage(this.currentNews.image);
      }
      news.image = await this.newsService.uploadImageToFirestore(this.imageFile);
    }
    if (this.typeForm === 'Actualizar Noticia' && this.currentNews != null){
      news.publishDate = this.currentNews.publishDate;
      news.id = this.currentNews.id;
    } else {
      news.publishDate = Timestamp.fromDate(new Date());
      news.id = news.publishDate + '-' + news.title.replace(/ /g,"-");
    } 
    return news;
  }

  private patchValueToForm(data: NewsInterface): void{
    try{
      let {id, publishDate, ...form} = data;
      form.image = '';    
      this.newsForm.patchValue(form);
    } catch (error){
      this.snackbar.showSnackBar("Error recuperando los datos de la noticia. Vuelve a intentarlo más tarde", 'cerrar', 12, 'snackbar-error');
    } 
  }

  async publishNews(news: NewsInterface): Promise<void>{
    try{
      await this.newsService.publishNews(news);
      this.snackbar.showSnackBar("Se ha publicado la noticia correctamente", 'cerrar', 8, 'snackbar-success');
      this.newsForm.reset();
    }catch (error){
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),'cerrar',  8,  'snackbar-error');
    }
  }

  async updateNews(news: NewsInterface): Promise<void>{
    try{
      await this.newsService.updateNews(news);
      this.snackbar.showSnackBar("Se ha actualizado la noticia correctamente", 'cerrar', 8, 'snackbar-success');
      this.goBack();
    } catch (error){
         this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                             'cerrar',  8,  'snackbar-error');
    }
  }
  
  getImageFile ($event: any): void{
    let extension = $event.target.files[0].name as string;
    extension = extension.slice(extension.lastIndexOf('.'));
    if (this.fileTypesPermited.includes(extension.toLowerCase())){
      this.imageFile = $event.target.files[0];
      this.inputImageError = false;
    } else {
      this.inputImageError = true;
    }
  }

  goBack(): void{
    this.location.back()
  }

}
