import { Injectable } from '@angular/core';
import { FirebaseService } from '../../services-shared/firebase.service';
import { StorageService } from '../../services-shared/storage.service';
import { NewsInterface } from '../../models/news.models';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private firebaseService: FirebaseService,
              private storageService: StorageService) { }

  imageUrl: string = '';

  saveImageURL(imageURL: string): void{
    this.imageUrl = imageURL;

  }

  async publishNews (news: NewsInterface): Promise<void>{
    try{
      await this.firebaseService.saveInFirestore(news, "noticias", news.id);
    } catch (error){
      throw(error);
    }
  }

  async uploadImageToFirestore(imageFile: File){
    try{
      return imageFile.name !== 'null.null' ? await this.storageService.uploadImage(imageFile, "Imagenes-noticias") :
        "https://firebasestorage.googleapis.com/v0/b/censo-palomar.appspot.com/o/assets-firebase%2Fcuadrado-grande-500.jpg?alt=media&token=b34f2714-9938-46c6-851c-2b6ccdcf47ed"
    } catch (error){
      throw(error);
    }
  }

  async getNewsWithId(newsId: string){
    try{
      let pigeon: NewsInterface = await this.firebaseService.getDocumentFromFirebase(newsId, 'noticias').then( response => {
        return response.data() as NewsInterface;
      });
      return pigeon;
    }catch (error){
      throw (error);
    }
  }

  async updateNews (news: NewsInterface){
    try{      
      await this.firebaseService.updateDocumentInFirestore(news, 'noticias', news.id);
    } catch (error){
      throw(error);
    }
  }

  async deleteNews (newsId: string){
    try{    
      await this.firebaseService.deleteDocumentInFirestore('noticias/'+newsId);
      await this.deleteNewsImage(this.imageUrl);
    } catch (error){
      throw(error);
    }
  }

  async deleteNewsImage (url: string){
    if ( url !== 'https://firebasestorage.googleapis.com/v0/b/censo-palomar.appspot.com/o/assets-firebase%2Fcuadrado-grande-500.jpg?alt=media&token=b34f2714-9938-46c6-851c-2b6ccdcf47ed' 
            && url != null && url !== ''){
      try{ 
        await this.storageService.deleteImage(url);
      } catch (error){
        throw(error);
      }
    }
  }

  getNewsFromFirebase(){
    try{
      return this.firebaseService.getCollectionFromFirebase<NewsInterface>('noticias');
    } catch (error){
      throw(error);
    }
  }

  async getLastestNews(numberNews: number): Promise<NewsInterface[]>{
    try{
      const snapshot =  await this.firebaseService.getLastest(3, 'noticias');
      return snapshot.docs.map(doc => doc.data() as NewsInterface);
    }catch (error){
      throw(error);
    }
  }

  
}
