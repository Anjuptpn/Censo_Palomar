import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import * as estados from '../../../../sections/Models/pigeonStates';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';


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
  styleUrl: './pigeon-form.component.sass'
})
export class PigeonFormComponent implements OnInit{
  @Input() typeForm!: string;

  private readonly formBuilder = inject(FormBuilder);

  states = estados.pigeonStates;

  hasRegisteredFather = true;
  hasRegisteredMother = true;

  pigeonForm!: FormGroup;

  ngOnInit(): void {
    this.inicializePigeonForm();
    this.pigeonForm.get('registeredFather')?.valueChanges.subscribe( active =>{
      this.hasRegisteredFather = active;
      console.log("Padre", this.hasRegisteredFather);    
    });
    this.pigeonForm.get('registeredMother')?.valueChanges.subscribe( active =>{
      this.hasRegisteredMother = active;
      console.log("Madre", this.hasRegisteredMother);      
    });
    
    
  }

  private inicializePigeonForm (){
    this.pigeonForm = this.formBuilder.group({
      pigeonName: ['', Validators.required],
      ring: ['', Validators.required],
      birthday: [ ''],
      gender: [''],
      color:[''],
      breed:[''],
      state: [''],
      registeredFather: ['true'],
      father: [''],
      registeredMother: ['true'],
      mother: [''],
      image: [''],
      notes: [''],
    });
  }

  submitPigeonRegister(){
    console.log("No está creado");
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
