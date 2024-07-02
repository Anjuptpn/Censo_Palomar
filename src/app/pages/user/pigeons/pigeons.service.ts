import { Injectable } from '@angular/core';
import { FirebaseService } from '../../../services-shared/firebase.service';
import { StorageService } from '../../../services-shared/storage.service';
import { PigeonInterface } from '../../../models/pigeon.model';

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
      await this.deletePigeonImage(this.imageURL);
    } catch (error){
      throw(error);
    }
  }

  async deletePigeonImage (url: string){
    if ( url !== 'https://firebasestorage.googleapis.com/v0/b/censo-palomar.appspot.com/o/assets-firebase%2Fcuadrado-grande-500.jpg?alt=media&token=b34f2714-9938-46c6-851c-2b6ccdcf47ed' 
            && url != null && url !== ''){
      await this.storageService.deleteImage(url);
    }
  }

  async uploadImageToFirestore(imageFile: File, path: string){
    try{
      if (imageFile.name !== 'null.null'){
        return await this.storageService.uploadImage(imageFile, path);
      } else {
        return "https://firebasestorage.googleapis.com/v0/b/censo-palomar.appspot.com/o/assets-firebase%2Fcuadrado-grande-500.jpg?alt=media&token=b34f2714-9938-46c6-851c-2b6ccdcf47ed"
      }
    } catch (error){
      throw(error);
    }
  }

  async registerPigeonInFirestore(userId: string, pigeon: PigeonInterface){
    try{
      const path = 'usuarios/'+userId+'/palomas';
      await this.firebaseService.saveInFirestore(pigeon, path, pigeon.id)
    } catch (error){
      throw(error);
    }
  }

  async updatePigeon (userId: string, pigeon: PigeonInterface){
    try{
      const path = 'usuarios/'+userId+'/palomas/';
      await this.firebaseService.updateDocumentInFirestore(pigeon, path, pigeon.id);
    } catch (error){
      throw(error);
    }
  }

  async getPigeonwithId(userId: string, pigeonId: string){
    try{
      const path = 'usuarios/'+userId+'/palomas';
      let pigeon: PigeonInterface = await this.firebaseService.getDocumentFromFirebase(pigeonId, path).then( response => {
        return response.data() as PigeonInterface;
      });
      return pigeon;
    }catch (error){
      console.log("Service Get Pigeon", error);
      throw (error);
    }
  }
}