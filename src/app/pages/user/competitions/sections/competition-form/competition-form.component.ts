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
import { FirebaseService } from '../../../../../services-shared/firebase.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatesService } from '../../../../../services-shared/dates.service';
import { CompetitionInterface } from '../../../../../models/competition.model';

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
  private readonly firebaseService = inject (FirebaseService);
  private readonly authService = inject(AuthService);
  readonly datesService = inject(DatesService);  
  private readonly location = inject(Location);

  currentUser: User | null = null;
  competitionForm!: FormGroup;
  private readonly numberPattern = /^\d+(.\d+)?$/; //No funciona con input type number.
  private readonly minutesAndSecondsPattern = /^[0-5][0-9]$/;
  private readonly hoursPattern = /^(0[0-9]|1[0-9]|2[0-3])$/;

  ngOnInit(): void {    
    this.inicializePigeonForm(this.typeForm);    
    this.authService.currentUserState.subscribe( (user) => {
      this.currentUser = user as User;
    })    
  }

  private inicializePigeonForm (type: string){
    if (type === 'Editar Paloma'){
      
      
    } else {
      this.competitionForm = this.formBuilder.group({
        ranking: [ , Validators.pattern(this.numberPattern)],
        competitionName: ['', Validators.required],
        competitionPlace: [''],
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
  }

  submitCompetitionForm(){
    if (this.competitionForm.valid){
      let competitionData: CompetitionInterface = this.prepareFormData();
      
      if (this.typeForm === "Editar Paloma"){
        console.log("En desarrollo");
      } else {
        this.registerCompetitionInFirestore(competitionData);
      }
    } else {
      this.snackbar.showSnackBar(
        `Hay campos obligatorios vacíos o incorrectos. \n Revisa bien los campos obligatorios`,
        'cerrar', 8, 'snackbar-error');
    }
  }

  prepareFormData(): CompetitionInterface{
    let competition: CompetitionInterface = <CompetitionInterface>{};
    competition.competitionDate = this.datesService.createFirebaseTimestamp(
      this.competitionForm.get('competitionDate')?.value, 
      this.competitionForm.get('startHour')?.value,
      this.competitionForm.get('startMinutes')?.value,
      this.competitionForm.get('startSeconds')?.value);
    competition.arriveDate = this.datesService.createFirebaseTimestamp(
      this.competitionForm.get('arriveDate')?.value,
      this.competitionForm.get('finishHour')?.value,
      this.competitionForm.get('finishMinutes')?.value,
      this.competitionForm.get('finishSeconds')?.value);       
    competition.duration = this.datesService.calculateDatesDifference(competition.arriveDate, competition.competitionDate);
    competition.registerDate = this.datesService.getCurrentDate();
    competition.ranking =  this.competitionForm.get('ranking')?.value;
    competition.competitionName = this.competitionForm.get('competitionName')?.value;
    competition.competitionPlace = this.competitionForm.get('competitionPlace')?.value;
    competition.competitionType = this.competitionForm.get('competitionType')?.value;
    competition.notes = this.competitionForm.get('notes')?.value;
    competition.points = this.competitionForm.get('points')?.value;
    competition.distance = this.competitionForm.get('distance')?.value;
    competition.competitionName = this.competitionForm.get('competitionName')?.value;
    competition.registerDate = this.datesService.getCurrentDate();
    competition.id = competition.registerDate + '-' + competition.competitionName;
    competition.speed = this.datesService.calculateSpeed(competition.distance, competition.duration);
    return competition;
  }

  async registerCompetitionInFirestore(competition: CompetitionInterface){    
    try{
      const path = 'usuarios/'+this.currentUser?.uid+'/palomas/'+this.pigeonId+'/competiciones';
      await this.firebaseService.saveInFirestore(competition, path, competition.id);
      this.snackbar.showSnackBar("Se ha añadido la competición correctamente", 'cerrar', 12, 'snackbar-success');
      this.competitionForm.reset();
    } catch (error){
      console.log(error);
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

}