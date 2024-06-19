import { Injectable, inject } from '@angular/core';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: Storage = inject(Storage);


  //Documentacion aquí: https://firebase.google.com/docs/storage/web/upload-files?hl=es-419
  async uploadImage(file: File, path: string): Promise<string>{
    if (file.name === "null.null"){
      return '';
    }
    const imagePath = path + "/" + file.name;
    const fileReference = ref(this.storage, imagePath);
    return uploadBytes(fileReference, file).then( async () => {
      const url = await getDownloadURL(fileReference);
      return url;
    }).catch((error)=> {
      throw(error);
    });
  }  
}
