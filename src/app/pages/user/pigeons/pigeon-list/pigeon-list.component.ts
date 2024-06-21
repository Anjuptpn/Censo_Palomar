import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from '../../../../services-shared/firebase.service';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../../auth/services/auth.service';
import { PigeonInterface } from '../../../../models/pigeon.model';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pigeon-list',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './pigeon-list.component.html',
  styleUrl: './pigeon-list.component.sass'
})
export class PigeonListComponent {
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);

  currentUser: User | null = null;
  pigeonList: PigeonInterface[] = []; 

  constructor(){
    this.authService.currentUserState.subscribe( (user) => {
      this.currentUser = user as User;
      this.getPigeonCollectionFromFirebase();
    }); 
  }

  getPigeonCollectionFromFirebase(){  
    try{
      const path = 'usuarios/'+this.currentUser?.uid+'/palomas';
      this.firebaseService.getCollectionFromFirebase<PigeonInterface>(path).subscribe( pigeons => {
        this.pigeonList = pigeons;
      });
    } catch (error){
      console.log(error);
    }     
  }
}