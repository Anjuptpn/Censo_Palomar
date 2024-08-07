import { Injectable, inject } from '@angular/core';
import { deleteObject, getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: Storage = inject(Storage);

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
  
  async deleteImage(url: string){
    if ( url !== 'https://firebasestorage.googleapis.com/v0/b/censo-palomar.appspot.com/o/assets-firebase%2Fcuadrado-grande-500.jpg?alt=media&token=b34f2714-9938-46c6-851c-2b6ccdcf47ed' 
                && url != null && url !== ''){
                  
      const path = this.extractPathFromUrl(url);
      const fileReference = ref(this.storage, path);
      await deleteObject(fileReference).catch ((error) => {
        throw(error);
      });
    }
  }

  private extractPathFromUrl(url: string): string{
    const startPosition = url.indexOf('/o/');
    const finishPosition = url.indexOf('?alt=');
    let path = url.slice(startPosition + 3, finishPosition);
    path = path.replaceAll('%2F', '/');
    path = path.replaceAll('%40', '@');
    path = decodeURI(path);
    return path;
  }

}
