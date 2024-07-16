import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackbarService } from '../../../../shared/snackbar/snackbar.service';
import { FirebaseErrorsService } from '../../../../services/firebase-errors.service';
import { AdsService } from '../../ads.service';
import { AdsInterface } from '../../../../models/ads.model';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Timestamp } from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../../../services/auth.service';
import { SpinnerService } from '../../../../services/spinner.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-ads',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, RouterLink],
  templateUrl: './form-ads.component.html',
  styleUrl: './form-ads.component.sass'
})
export class FormAdsComponent {
  @Input() typeForm!: string;
  @Input() adsId?: string | null;

  private readonly formBuilder = inject(FormBuilder);
  private readonly snackbar = inject(SnackbarService);
  private readonly router = inject(Router);
  private readonly firebaseErrors = inject(FirebaseErrorsService);
  private readonly adsService = inject(AdsService);
  private readonly authService = inject(AuthService);
  private readonly spinnerService = inject(SpinnerService);

  imageFile = new File([], "null.null");
  inputImageError: boolean =  false;
  fileTypesPermited = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  adsForm!: FormGroup;
  currentAds: AdsInterface | null = null;
  currentUser: User | null = null;
  currentUserSubcribe: any;

  ngOnInit(): void {
    this.spinnerService.showLoading();
    this.currentUserSubcribe = this.authService.currentUserState.subscribe( (user) => {
      this.currentUser = user;
      if (this.currentUser != null && this.typeForm === "Actualizar Anuncio"){
        this.getAdToEdit();
      }
      this.spinnerService.stopLoading();
    })
    this.inicializeadsForm();
       
  }

  private inicializeadsForm (): void{
    this.adsForm = this.formBuilder.group({
      title: ['', Validators.required],
      details: [''],      
      price: ['', Validators.required],
      contact: ['', Validators.required],
      image: ['']
    });       
  }
  
  private async getAdToEdit(): Promise<void>{
    try{
      if (this.adsId == null || this.adsId == undefined || this.adsId == ''){
        this.snackbar.showSnackBar("No hay seleccionada ningún anuncio, vuelve hacia atrás y reinténtalo.", 'cerrar', 12, 'snackbar-error');
      } else if (this.currentUser == null || this.currentUser == undefined){
        this.snackbar.showSnackBar("Es necesario iniciar sesión para editar la noticia", 'cerrar', 12, 'snackbar-error');
      } else {
        this.spinnerService.showLoading();
        this.currentAds = await this.adsService.getAdById(this.adsId);
        if (this.currentAds.userId === this.currentUser.uid){
          this.patchValueToForm(this.currentAds);
        } else {
          this.snackbar.showSnackBar("No tienes permiso para editar este anuncio", 'cerrar', 12, 'snackbar-error');
          this.router.navigateByUrl('ads/publish-ads');
        }
        this.spinnerService.stopLoading();
      }
    } catch (error){
      this.spinnerService.stopLoading();
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string), 
                                       'cerrar', 8, 'snackbar-error');
    }
  }

  async submitAds(): Promise<void>{
    this.spinnerService.showLoading();
    if(this.currentUser != null && this.currentUser != undefined){
      if(this.adsForm.valid){     
        this.prepareFormData().then(ads => {
           if (this.typeForm === "Actualizar Anuncio"){
             this.updateAds(ads);
           } else {
             this.publishAd(ads);
           }        
         }).catch(error => {
           this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                                'cerrar',  8,  'snackbar-error');
         }).finally(() => this.spinnerService.stopLoading());
       } else {
        this.spinnerService.stopLoading();
         this.snackbar.showSnackBar(`Hay campos obligatorios vacíos o incorrectos. \n Revisa bien los campos`,
           'cerrar',  8, 'snackbar-error');
       }
    } else {
      this.spinnerService.stopLoading();
      this.snackbar.showSnackBar(`Es necesario iniciar sesión`, 'cerrar',  8, 'snackbar-error');
    }
  }

  private patchValueToForm(data: AdsInterface): void{
    try{
      let {id, publishDate, userId, ...form} = data;
      form.image = '';    
      this.adsForm.patchValue(form);
    } catch (error){
      this.snackbar.showSnackBar("Error recuperando los datos del Anuncio. Vuelve a intentarlo más tarde", 'cerrar', 12, 'snackbar-error');
    } 
  }

  private async prepareFormData(): Promise<AdsInterface>{
    let ads: AdsInterface = this.adsForm.value as AdsInterface;
    if (this.typeForm === "Actualizar Anuncio" && this.imageFile.name === 'null.null' && this.currentAds != null){
      ads.image = this.currentAds!.image;
    } else {
      if (this.typeForm === "Actualizar Anuncio" && this.currentAds != null){
        this.adsService.deleteAdImage(this.currentAds.image);
      }
      ads.image = await this.adsService.uploadImageToFirestore(this.imageFile);
    }
    if (this.typeForm === 'Actualizar Anuncio' && this.currentAds != null){
      ads.publishDate = this.currentAds.publishDate;
      ads.id = this.currentAds.id;
      ads.userId = this.currentAds.userId;
    } else {
      ads.publishDate = Timestamp.fromDate(new Date());
      ads.id = ads.publishDate + '-' + ads.title.replace(/ /g,"-");
      ads.userId = this.currentUser!.uid;
    } 
    return ads;
  }

  async publishAd(ads: AdsInterface): Promise<void>{
    try{
       await this.adsService.publishAd(ads);
       this.snackbar.showSnackBar("Se ha publicado el anuncio correctamente", 'cerrar', 8, 'snackbar-success');
       this.adsForm.reset();
       this.router.navigateByUrl("/user/my-ads");
    }catch (error){
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),'cerrar',  8,  'snackbar-error');
    }
  }

  async updateAds(ads: AdsInterface): Promise<void>{
    try{
        if (this.currentUser != null && this.currentUser != undefined){
          await this.adsService.updateAd(ads);
          this.snackbar.showSnackBar("Se ha actualizado la noticia correctamente", 'cerrar', 8, 'snackbar-success');
          this.router.navigateByUrl("/user/my-ads");
        } else {
          this.snackbar.showSnackBar("Se ha actualizado la noticia correctamente", 'cerrar', 8, 'snackbar-success');
        }
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

}
