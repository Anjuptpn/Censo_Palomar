import { Component, Input, OnInit, inject } from '@angular/core';
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
import { FirebaseService } from '../../../../../services-shared/firebase.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { StorageService } from '../../../../../services-shared/storage.service';
import { PigeonInterface } from '../../../../../models/pigeon.model';



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
export class PigeonFormComponent implements OnInit{
  @Input() typeForm!: string;
  @Input() pigeonId!: string;

  private readonly formBuilder = inject(FormBuilder);
  private readonly snackbar = inject(SnackbarService);
  private readonly firebaseErrors = inject(FirebaseErrorsService);
  private readonly firebaseService = inject (FirebaseService);
  private readonly authService = inject(AuthService);
  private readonly storageService = inject(StorageService);
  private readonly location = inject(Location);

  states = estados.pigeonStates;
  currentUser: User | null = null;
  imageFile = new File([], "null.null");
  hasRegisteredFather = true;
  hasRegisteredMother = true;
  pigeonForm!: FormGroup;


  ngOnInit(): void {    
    this.inicializePigeonForm(this.typeForm);
    this.pigeonForm.get('registeredFather')?.valueChanges.subscribe( active =>{
      this.hasRegisteredFather = active;
      //console.log("Padre", this.hasRegisteredFather);    
    });
    this.pigeonForm.get('registeredMother')?.valueChanges.subscribe( active =>{
      this.hasRegisteredMother = active;
      //console.log("Madre", this.hasRegisteredMother);      
    });
    this.authService.currentUserState.subscribe( (user) => {
      this.currentUser = user as User;
    })    
  }

  private inicializePigeonForm (type: string){
    console.log(type);
    if (type === 'Editar Paloma'){
      this.pigeonForm = this.formBuilder.group({
        pigeonName: ['Parchita', Validators.required],
        ring: ['CAN0152452-23', Validators.required],
        birthday: [ ''],
        gender: ['Macho'],
        color:['Rodado'],
        breed:['Jansen'],
        state: ['Viva'],
        registeredFather: [false],
        father: ['Valeroso'],
        registeredMother: [false],
        mother: ['Bienmesabe'],
        image: ['https://media.istockphoto.com/id/155552819/es/foto/paloma-blanca.webp?s=1024x1024&w=is&k=20&c=vDWrbuNOygy6IFILWAL9Y4v1lcfr8bf4glA44aU0xKE='],
        notes: ['Las notas son importartes, pero en este caso no hay. Gracias por su colaboración. Gracias.'],
      });
      this.hasRegisteredFather = this.pigeonForm.get('registeredFather')?.value;
      this.hasRegisteredMother = this.pigeonForm.get('registeredMother')?.value;
    } else {
      this.pigeonForm = this.formBuilder.group({
        pigeonName: ['', Validators.required],
        ring: ['', Validators.required],
        birthday: [],
        gender: [''],
        color:[''],
        breed:[''],
        state: [''],
        registeredFather: [true],
        father: [''],
        registeredMother: [true],
        mother: [''],
        image: [''],
        notes: [''],
      });
    }
  }

  submitPigeonForm(){
    if(this.pigeonForm.valid){
      if (this.typeForm === "Editar Paloma"){
        console.log("En desarrollo");
      } else {
        this.registerPigeonInFirestore();
      }
    } else {
      this.snackbar.showSnackBar(`Hay campos obligatorios vacíos. \n Revisa bien los campos obligatorios`,
        'cerrar',  8, 'snackbar-error');
    }
  }

  async registerPigeonInFirestore(){
    try{
      let pigeonData: PigeonInterface = this.pigeonForm.value;
      pigeonData.registerDate = Timestamp.fromDate(new Date());
      pigeonData.id = pigeonData.registerDate + '-' + pigeonData.ring.replace(/ /g,"-");
      pigeonData.image = await this.uploadImageToFirestore(this.imageFile, 'Palomas/'+this.currentUser?.email); 
      const path = 'usuarios/'+this.currentUser?.uid+'/palomas';
      await this.firebaseService.saveInFirestore(pigeonData, path, pigeonData.id);
      this.snackbar.showSnackBar("Se ha añadido la paloma correctamente", 'cerrar', 8, 'snackbar-success');
      this.pigeonForm.reset();
    } catch (error){
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                          'cerrar',  8,  'snackbar-error');
    }
    
  }

  async uploadImageToFirestore(imageFile: File, path: string){
    try{
      console.log("Nombre de la Imagen", imageFile.name);
      if (imageFile.name !== 'null.null'){
        return await this.storageService.uploadImage(imageFile, path);
      } else {
        return "https://firebasestorage.googleapis.com/v0/b/censo-palomar.appspot.com/o/assets-firebase%2Fcuadrado-grande-500.jpg?alt=media&token=b34f2714-9938-46c6-851c-2b6ccdcf47ed"
      }
    } catch (error){
      throw(error);
    }

  }

  getImageFile ($event: any){
    this.imageFile = $event.target.files[0];
  }

  goBack(): void{
    this.location.back()
  }

  mockdataPigeon =[
    {
      "anilla": "ESP0021284-2021",
      "nombre": "Estrella",
    },
    {
      "anilla": "ESP0024523-2018",
      "nombre": "Campeón",
    },
    {
      "anilla": "ESP0222598-2022",
      "nombre": "Flecha",
    },
    {
      "anilla": "CAN0565124-2023",
      "nombre": "Canaria",
    },
    {
      "anilla": "NOR-017-0466",
      "nombre": "Noruega",
    },
    {
      "anilla": "HUNG-D-759392",
      "nombre": "Húngara",
    }
  ];

}
