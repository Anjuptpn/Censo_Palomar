import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  //private authService = inject(AuthService);
  private firestore = inject(Firestore);

  constructor() { }

  //Almacenar Datos
  async saveInFirestore(dataCollection: any, path: string, id: string){
    try{
      const document = doc(this.firestore, path, id);
      return await setDoc(document, dataCollection);
    } catch (error){
      console.log(error);
      throw (error);
    }
  }

  //Recuperar una colección concreta
  async getCollectionFromFirebase(id: string, path: string){
    try{
      const document = doc(this.firestore, path, id);
      return await getDoc(document);
    } catch (error){
      throw (error);
    }
  }

  
  



}
