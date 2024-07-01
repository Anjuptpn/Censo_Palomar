import { Injectable } from '@angular/core';
import { FirebaseService } from '../../../services-shared/firebase.service';
import { StorageService } from '../../../services-shared/storage.service';

@Injectable({
  providedIn: 'root'
})
export class PigeonsService {

  private imageURL: string = '';

  constructor(private firebaseService: FirebaseService,
              private storageService: StorageService
  ) { }
  

  saveImageURL(imageURL: string): void{
    this.imageURL = imageURL;

  }

  async deletePigeon (userId: string, pigeonId: string){
    try{
      const path = 'usuarios/'+userId+'/palomas/'+pigeonId;      
      await this.firebaseService.deleteDocumentInFirestore(path);
      await this.deletePigeonImage();
    } catch (error){
      throw(error);
    }
  }

  async deletePigeonImage (){
    console.log("La imagen es: ", this.imageURL);
    if ( this.imageURL !== 'https://firebasestorage.googleapis.com/v0/b/censo-palomar.appspot.com/o/assets-firebase%2Fcuadrado-grande-500.jpg?alt=media&token=b34f2714-9938-46c6-851c-2b6ccdcf47ed' 
            && this.imageURL != null && this.imageURL !== ''){
      await this.storageService.deleteImage(this.imageURL);
    }

  }
}
