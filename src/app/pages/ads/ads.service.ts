import { Injectable } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { StorageService } from '../../services/storage.service';
import { AdsInterface } from '../../models/ads.model';

@Injectable({
  providedIn: 'root'
})
export class AdsService {

  constructor(private firebaseService: FirebaseService,
              private storageService: StorageService) { }

  imageUrl: string = '';

  saveImageURL(imageURL: string): void{
    this.imageUrl = imageURL;

  }

  async publishAd (ads: AdsInterface): Promise<void>{
    try{
      await this.firebaseService.saveInFirestore(ads, 'anuncios', ads.id);
    } catch (error){
      console.log(error);
      throw(error);
    }
  }

  async uploadImageToFirestore(imageFile: File,){
    try{
      const date = new Date();
      const path = date.getFullYear()+'-'+(date.getMonth()+1);
      console.log(path);
      return imageFile.name !== 'null.null' ? await this.storageService.uploadImage(imageFile, "Imagenes-anuncios/"+path) :
        "assets/Paloma con color-2 relleno- 500x500.png"
    } catch (error){
      throw(error);
    }
  }

  async getAdById(adsId: string){
    try{
      let ads: AdsInterface = await this.firebaseService.getDocumentFromFirebase(adsId, '/anuncios').then( response => {
        return response.data() as AdsInterface;
      });
      return ads;
    }catch (error){
      throw (error);
    }
  }

  async updateAd (ads: AdsInterface){
    try{      
      await this.firebaseService.updateDocumentInFirestore(ads, 'anuncios', ads.id);
    } catch (error){
      throw(error);
    }
  }

  async deleteAd (adsId: string, imageUrl: string){
    try{    
      await this.firebaseService.deleteDocumentInFirestore('anuncios/'+adsId);
      await this.deleteAdImage(imageUrl);
    } catch (error){
      throw(error);
    }
  }

  async deleteAdImage (url: string){
    if ( url !== '/assets/Paloma con color-2 relleno- 500x500.png' 
            && url != null && url !== ''){
      try{ 
        await this.storageService.deleteImage(url);
      } catch (error){
        throw(error);
      }
    }
  }

  getAdsFromFirebase(){
    try{
      return this.firebaseService.getCollectionFromFirebase<AdsInterface>('anuncios');
    } catch (error){
      throw(error);
    }
  }

  async getLastestAds(numberAds: number): Promise<AdsInterface[]>{
    try{
      const snapshot =  await this.firebaseService.getLastest(numberAds, 'anuncios');
      return snapshot.docs.map(doc => doc.data() as AdsInterface);
    }catch (error){
      throw(error);
    }
  }

  async getUserAdsWithId(userId: string): Promise<AdsInterface[]>{
    try{
      const snapshot =  await this.firebaseService.getDocumentsWithQuery('anuncios', 'userId', '==', userId, 'id');
      return snapshot.docs.map(doc => doc.data() as AdsInterface);
    }catch (error){
      throw(error);
    }

  }
  
}
