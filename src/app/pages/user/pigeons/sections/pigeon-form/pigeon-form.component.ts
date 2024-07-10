import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import * as estados from '../../../../../models/pigeonStates';
import { CommonModule, Location } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Timestamp } from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
import { SnackbarService } from '../../../../../sections/snackbar/snackbar.service';
import { FirebaseErrorsService } from '../../../../auth/services/firebase-errors.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { PigeonInterface } from '../../../../../models/pigeon.model';
import { PigeonsService } from '../../pigeons.service';
import { SpinnerService } from '../../../../../services-shared/spinner.service';



@Component({
  selector: 'app-pigeon-form',
  standalone: true,
  providers: [provideNativeDateAdapter(),],
  imports: [MatButtonModule, 
              MatInputModule, 
              MatRadioModule, 
              ReactiveFormsModule, 
              MatFormFieldModule,
              MatDatepickerModule,
              MatAutocompleteModule,
              MatSlideToggleModule,
              CommonModule,
              MatSelectModule ],
  templateUrl: './pigeon-form.component.html',
  styleUrl: '../../../../../general-styles/form-styles.sass'
})
export class PigeonFormComponent implements OnInit, OnDestroy{
  @Input() typeForm!: string;
  @Input() pigeonId!: string;

  private readonly formBuilder = inject(FormBuilder);
  private readonly snackbar = inject(SnackbarService);
  private readonly firebaseErrors = inject(FirebaseErrorsService);
  private readonly authService = inject(AuthService);
  private readonly location = inject(Location);
  private readonly pigeonService = inject(PigeonsService);
  private spinnerService = inject(SpinnerService);

  states = estados.pigeonStates;
  currentUser: User | null = null;
  imageFile = new File([], "null.null");
  hasRegisteredFather = true;
  hasRegisteredMother = true;
  pigeonForm!: FormGroup;
  currentPigeon: PigeonInterface | null = null;
  malePigeons: PigeonInterface[] | null | undefined = null;
  femalePigeons: PigeonInterface[] | null | undefined= null;

  currentAuthSubcribe: any;
  pigeonMother: any;
  pigeonFather: any;

  ngOnInit(): void { 
    this.spinnerService.showLoading();   
    this.inicializePigeonForm(this.typeForm);
    this.pigeonFather = this.pigeonForm.get('registeredFather')?.valueChanges.subscribe( active =>{
      this.hasRegisteredFather = active;  
    });
    this.pigeonMother = this.pigeonForm.get('registeredMother')?.valueChanges.subscribe( active =>{
      this.hasRegisteredMother = active;     
    });
    this.currentAuthSubcribe = this.authService.currentUserState.subscribe( (user) => {
      this.currentUser = user as User;
      if (user != null) {
        this.getPigeonsByGender('Macho', user.uid).then(response => {
          this.malePigeons = this.typeForm === "Editar Paloma" ? response?.filter(resp => resp.id != this.pigeonId) : response});
        this.getPigeonsByGender('Hembra', user.uid).then(response => {
          this.femalePigeons = this.typeForm === "Editar Paloma" ? response?.filter(resp => resp.id != this.pigeonId) : response});
      }
      if (this.typeForm === "Editar Paloma" && user != null){
        this.getPigeonToEdit(user?.uid);
      }
      this.spinnerService.stopLoading();
    })    
  }

  private inicializePigeonForm (type: string){
    this.pigeonForm = this.formBuilder.group({
      pigeonName: ['', Validators.required],
      ring: ['', Validators.required],
      birthday: [],
      gender: [''],
      color:[''],
      breed:[''],
      state: [''],
      registeredFather: [true],
      fatherId: [''],
      father: [''],
      registeredMother: [true],
      mother: [''],
      motherId: [''],
      image: [''],
      notes: [''],
    });       
  }

  submitPigeonForm(){
    if(this.pigeonForm.valid){      
      this.prepareFormData().then(pigeon => {
        if (this.typeForm === "Editar Paloma"){
          this.updatePigeon(pigeon);
        } else {
          this.registerPigeon(pigeon);
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

  async prepareFormData(): Promise<PigeonInterface>{ 
    let pigeonData: PigeonInterface = this.pigeonForm.value;    
    if (this.typeForm === 'Editar Paloma' && this.imageFile.name === 'null.null'){
      pigeonData.image = this.currentPigeon!.image;
    } else {
      if (this.typeForm === "Editar Paloma"){
        this.pigeonService.deletePigeonImage(this.currentPigeon!.image);
      }
      pigeonData.image = await this.pigeonService.uploadImageToFirestore(this.imageFile, 'Palomas/'+this.currentUser?.email);
    } 
    if (this.typeForm === 'Editar Paloma' && this.currentPigeon != null){
      pigeonData.registerDate = this.currentPigeon.registerDate;
      pigeonData.id = this.currentPigeon.id;
    } else {
      pigeonData.registerDate = Timestamp.fromDate(new Date());
      pigeonData.id = pigeonData.registerDate + '-' + pigeonData.ring.replace(/ /g,"-");
    }
    return pigeonData;
  }  

  async registerPigeon(pigeon: PigeonInterface){
    this.spinnerService.showLoading();
    try{
      if (this.currentUser == null || this.currentUser == undefined){
        this.snackbar.showSnackBar("Debes estar registrado para añadir una paloma", 'cerrar', 12, 'snackbar-error');
      } else {
        await this.pigeonService.registerPigeonInFirestore(this.currentUser.uid, pigeon);
        this.snackbar.showSnackBar("Se ha añadido la paloma correctamente", 'cerrar', 8, 'snackbar-success');
        this.pigeonForm.reset();
        this.goBack();
      }
      this.spinnerService.stopLoading();
    } catch (error){
        this.spinnerService.stopLoading();
         this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                             'cerrar',  8,  'snackbar-error');
    }
  } 

  async updatePigeon(pigeon: PigeonInterface){
    this.spinnerService.showLoading();
    try{
      if (this.currentUser == null || this.currentUser == undefined){
        this.snackbar.showSnackBar("Debes estar registrado para añadir una paloma", 'cerrar', 12, 'snackbar-error');
      } else {
        await this.pigeonService.updatePigeon(this.currentUser.uid, pigeon);
        this.snackbar.showSnackBar("Se ha actualizado la paloma correctamente", 'cerrar', 8, 'snackbar-success');
        this.goBack();
        this.spinnerService.stopLoading();
      }
    } catch (error){
      this.spinnerService.stopLoading();
         this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                             'cerrar',  8,  'snackbar-error');
    }
  } 

  getImageFile ($event: any){
    this.imageFile = $event.target.files[0];
  }

  goBack(): void{
    this.location.back()
  }

  ngOnDestroy(): void {
    this.currentAuthSubcribe.unsubscribe();
    this.pigeonMother.unsubscribe();
    this.pigeonFather.unsubscribe();
  }

  private async getPigeonToEdit(userId: string){
    this.spinnerService.showLoading();
    try{
      if (userId == null || userId == undefined || userId == ''){
        this.snackbar.showSnackBar("Debes estar registrado para ver la información de una paloma", 'cerrar', 12, 'snackbar-error');
      } else if (this.pigeonId == null || this.pigeonId == undefined || this.pigeonId == ''){
        this.snackbar.showSnackBar("No hay seleccionada ninguna paloma, vuelve hacia atrás y reinténtalo.", 'cerrar', 12, 'snackbar-error');
      } else {
        this.currentPigeon = await this.pigeonService.getPigeonwithId(userId, this.pigeonId) as PigeonInterface;
        this.patchValueToForm(this.currentPigeon);
      }
      this.spinnerService.stopLoading();
    }catch (error){
      this.spinnerService.stopLoading();
       this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string), 
                                        'cerrar', 8, 'snackbar-error');
    }
  }

  private patchValueToForm(data: PigeonInterface): void{
    const birthdayDate = data.birthday != null ? new Date(data.birthday.toMillis()) : '';

    let {id, registerDate, ...form} = data;
    form.image = ''; //Si no da error porque no coincide la URL con una ruta de archivo.
    try{
      this.pigeonForm.patchValue(form);
      this.pigeonForm.patchValue({
        birthday: data.birthday != null ? new Date(data.birthday.toMillis()) : null,
      });
      this.hasRegisteredFather = data.registeredFather;
      this.hasRegisteredMother = data.registeredMother; 
    } catch (error){
      this.snackbar.showSnackBar("Error recuperando los datos de la paloma. Vuelve a intentarlo más tarde", 'cerrar', 12, 'snackbar-error');
    }    
  }

  private async getPigeonsByGender(gender: string, userId: string): Promise<PigeonInterface[] | null>{
    try{
      if (userId == null || userId == undefined){
        this.snackbar.showSnackBar("Debes estar registrado para ver esta sección", 'cerrar', 12, 'snackbar-error');
        return null;
      } else {
        return await this.pigeonService.getPigeonsByGender(gender, userId);
      }      
    } catch (error){
      this.snackbar.showSnackBar("Ha ocurrido un error al recuperar las palomas "+gender, 'cerrar', 12, 'snackbar-error');
      return null;
    }
  }

  onChangeParents(field: string, $event: string){
    if (field === "father"){
      this.pigeonForm.patchValue({father: this.getFatherNameWithId(this.malePigeons, $event)});
    }else if (field === "mother"){
      this.pigeonForm.patchValue({mother: this.getFatherNameWithId(this.femalePigeons, $event)});
    }
  }

  private getFatherNameWithId(parents: PigeonInterface[] | null | undefined, id: string){    
    return parents != null && parents != undefined ? parents.find(parent => parent.id === id)?.pigeonName : '';
  }

}
