import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { CommonModule, Location } from '@angular/common';
import { User } from '@angular/fire/auth';
import { SnackbarService } from '../../../../../sections/snackbar/snackbar.service';
import { FirebaseErrorsService } from '../../../../auth/services/firebase-errors.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatesService } from '../../../../../services-shared/dates.service';
import { CompetitionInterface } from '../../../../../models/competition.model';
import { CompetitionsService } from '../../competitions.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../../../../../services-shared/spinner.service';

@Component({
  selector: 'app-competition-form',
  standalone: true,
  providers: [provideNativeDateAdapter(),],
  imports: [MatButtonModule, 
    MatInputModule,  
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    CommonModule ],
  templateUrl: './competition-form.component.html',
  styleUrls: ['./competition-form.component.sass', '../../../../../general-styles/form-styles.sass']
})
export class CompetitionFormComponent {
  
  @Input() pigeonId!: string;
  @Input() competitionId!: string;
  @Input() typeForm!: string;

  private readonly formBuilder = inject(FormBuilder);
  private readonly snackbar = inject(SnackbarService);
  private readonly firebaseErrors = inject(FirebaseErrorsService);
  private readonly authService = inject(AuthService);
  readonly datesService = inject(DatesService);  
  private readonly location = inject(Location);
  private readonly competitionsService = inject(CompetitionsService);
  private readonly router = inject(Router);
  private spinnerService = inject(SpinnerService);
  

  currentUser: User | null = null;
  competitionForm!: FormGroup;
  //currentCompetition: CompetitionInterface | null = null;
  currentCompetition: any = null;
  private readonly numberPattern = /^\d+(.\d+)?$/; //No funciona con input type number.
  private readonly minutesAndSecondsPattern = /^[0-5][0-9]$/;
  private readonly hoursPattern = /^(0[0-9]|1[0-9]|2[0-3])$/;

   ngOnInit(): void {  
    this.spinnerService.showLoading();  
    this.inicializePigeonForm();
    this.authService.currentUserState.subscribe( (user) => {
      this.currentUser = user as User;
      if (this.typeForm === 'Editar Competición' && user != null ){
        this.getCompetitionToEdit(user.uid);
      }        
      this.spinnerService.stopLoading();   
    });     
  }

  private inicializePigeonForm (){    
    this.competitionForm = this.formBuilder.group({
      ranking: [ , Validators.pattern(this.numberPattern)],
      competitionName: ['', Validators.required],
      competitionPlace: [],
      competitionType: [],
      competitionDate: [],
      arriveDate: [],
      distance: [, Validators.pattern(this.numberPattern)],
      points: [ , Validators.pattern(this.numberPattern)],
      startHour: [, Validators.pattern(this.hoursPattern)],
      startMinutes: [,Validators.pattern(this.minutesAndSecondsPattern)],
      startSeconds: [,Validators.pattern(this.minutesAndSecondsPattern)],
      finishHour: [, Validators.pattern(this.hoursPattern)],
      finishMinutes: [,Validators.pattern(this.minutesAndSecondsPattern)],
      finishSeconds: [,Validators.pattern(this.minutesAndSecondsPattern)],
      notes: [''],        
    });
  }

  submitCompetitionForm(){
    
    if (this.competitionForm.valid){
      const competitionData: CompetitionInterface = this.prepareFormData();            
      if (this.typeForm === "Editar Competición"){
        this.updateCompetition(competitionData);
      } else {
        this.registerCompetition(competitionData);
      }      
    } else {
      this.snackbar.showSnackBar(
        `Hay campos obligatorios vacíos o incorrectos. \n Revisa bien los campos obligatorios`,
        'cerrar', 8, 'snackbar-error');
    }
  }

  prepareFormData(): CompetitionInterface{
    const startDate = this.datesService.createFirebaseTimestamp(
      this.competitionForm.value.competitionDate, this.competitionForm.value.startHour, 
      this.competitionForm.value.startMinutes, this.competitionForm.value.startSeconds);
    const finishDate = this.datesService.createFirebaseTimestamp(
      this.competitionForm.value.arriveDate, this.competitionForm.value.finishHour, 
      this.competitionForm.value.finishMinutes, this.competitionForm.value.finishSeconds);    
    const duration = this.datesService.calculateDatesDifference(finishDate, startDate);

    let competition: CompetitionInterface = {
      competitionName: this.competitionForm.value.competitionName,
      competitionType: this.competitionForm.value.competitionType,
      competitionPlace: this.competitionForm.value.competitionPlace,
      points: this.competitionForm.value.points,
      ranking: this.competitionForm.value.ranking,
      notes: this.competitionForm.value.notes,
      distance: this.competitionForm.value.distance,
      competitionDate: startDate,
      arriveDate: finishDate,
      duration: duration,
      speed: this.datesService.calculateSpeed(this.competitionForm.value.distance, duration),
      registerDate: null,
      id : ''      
    };  
    
    if (this.typeForm == "Editar Competición"){
      competition.registerDate = this.currentCompetition.registerDate;
      competition.id = this.currentCompetition.id;
    } else {
      const currentDate = this.datesService.getCurrentDate();
      competition.registerDate = currentDate;
      competition.id = currentDate+ '-' + this.competitionForm.value.competitionName.replace(/ /g,"-");
    }
    return competition;
  }

  async registerCompetition(competition: CompetitionInterface){    
    try{
      this.spinnerService.showLoading();
      if (this.currentUser == null || this.currentUser == undefined){
        this.snackbar.showSnackBar("Debes estar registrado para añadir una competición", 'cerrar', 12, 'snackbar-error');
      } else if (this.pigeonId == null){
        this.snackbar.showSnackBar("No hay una paloma asociada a esta competición, vuelve hacia atrás y selecciona una paloma", 'cerrar', 12, 'snackbar-error');
      } else {
        await this.competitionsService.registerCompetitionInFirestore(this.currentUser?.uid, this.pigeonId, competition);
        this.snackbar.showSnackBar("Se ha añadido la competición correctamente", 'cerrar', 12, 'snackbar-success');
        this.competitionForm.reset();
      }
      this.spinnerService.stopLoading();
    } catch (error){
      this.spinnerService.stopLoading();
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                                  'cerrar', 12, 'snackbar-error');
    }    
  }

  async updateCompetition(competition: CompetitionInterface){    
    try{
      this.spinnerService.showLoading();
      if (this.currentUser == null || this.currentUser == undefined){
        this.snackbar.showSnackBar("Debes estar registrado para editar una competición", 'cerrar', 12, 'snackbar-error');
      } else if (this.pigeonId == null){
        this.snackbar.showSnackBar("No hay una paloma asociada a esta competición, vuelve hacia atrás y selecciona una paloma", 'cerrar', 12, 'snackbar-error');
      } else {
        await this.competitionsService.updateCompetition(this.currentUser?.uid, this.pigeonId, competition);
        this.snackbar.showSnackBar("Se ha actualizado la competición correctamente", 'cerrar', 12, 'snackbar-success');
        this.competitionForm.reset();
        this.goBack();
      }
      this.spinnerService.stopLoading();
    } catch (error){
      this.spinnerService.stopLoading();
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                                  'cerrar', 12, 'snackbar-error');
    }    
  }

  //Si el campo está vacío ponemos la misma fecha
  onChangeCompetitionDate(){
    if(this.competitionForm.get('arriveDate')?.value == null){
      this.competitionForm.get('arriveDate')?.setValue(this.competitionForm.get('competitionDate')?.value)
    }
  }

  goBack(): void{
    this.location.back()
  }

  //Funciones para editar
  async getCompetitionToEdit(userId: string){    
    try{
      this.spinnerService.showLoading();
      if (userId == null || userId == undefined || userId == ''){
        this.snackbar.showSnackBar("Debes estar registrado para editar una competición", 'cerrar', 12, 'snackbar-error');
      } else {
        this.currentCompetition = await this.competitionsService.getCompetitionWithId(userId, this.pigeonId, this.competitionId) as CompetitionInterface;
        this.patchValueToForm(this.currentCompetition);
      }
      this.spinnerService.stopLoading();
    } catch (error){
      this.spinnerService.stopLoading();
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string), 
                                      'cerrar', 8, 'snackbar-error');
    } 
  }

  patchValueToForm(data: CompetitionInterface){
    const startDate = this.datesService.separateDateComponents(data.competitionDate);
    const finishDate = this.datesService.separateDateComponents(data.arriveDate);
    
    let dataForm = {
      competitionName: data.competitionName,
      competitionPlace: data.competitionPlace,
      competitionType: data.competitionType,
      ranking: data.ranking,
      notes: data.notes,
      points: data.points,
      distance: data.distance,
      competitionDate: startDate?.date,
      startHour: startDate?.hour,
      startMinutes: startDate?.minutes,
      startSeconds: startDate?.seconds,
      arriveDate: finishDate?.date,
      finishHour: finishDate?.hour,
      finishMinutes: finishDate?.minutes,
      finishSeconds: finishDate?.seconds
    }
    this.competitionForm.patchValue(dataForm)    
  }

}