import { Injectable, inject } from '@angular/core';
import { deleteObject, getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';

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
      console.log("Uploadimage", error)
      throw(error);
    });
  }
  
  //Documentación: https://firebase.google.com/docs/storage/web/delete-files?hl=es-419
  async deleteImage(url: string){
    const path = this.extractPathFromUrl(url);
    const fileReference = ref(this.storage, path);
    await deleteObject(fileReference).catch ((error) => {
      throw(error);
    });
  }

  private extractPathFromUrl(url: string): string{
    const startPosition = url.indexOf('/o/');
    const finishPosition = url.indexOf('?alt=');
    let path = url.slice(startPosition + 3, finishPosition);
    path = path.replaceAll('%2F', '/');
    path = path.replaceAll('%40', '@');
    return path;
  }
}
