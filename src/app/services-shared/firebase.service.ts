import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { PigeonInterface } from '../models/pigeon.model';


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
      throw (error);
    }
  }

  //Recuperar una colección concreta
  async getDocumentFromFirebase(id: string, path: string){
    try{
      const document = await doc(this.firestore, path, id);
      return getDoc(document);
    } catch (error){
      throw (error);
    }
  }

  getCollectionFromFirebase<collectionType>(path: string): Observable<collectionType[]>{
    try{
      const dataCollection = collection(this.firestore, path);
      return collectionData(dataCollection) as Observable<collectionType[]>;
    } catch (error){
      throw (error);
    }

  }

  //Actualizar Documentos
  async updateDocumentInFirestore(dataCollection: any, path: string, id: string){
    try{
      const document = doc(this.firestore, path, id);
      return await updateDoc(document, dataCollection);
    } catch (error){
      throw (error);
    }
  }

  async deleteDocumentInFirestore(path: string){
    try{
      const document = doc(this.firestore, path);
      return await deleteDoc(document);
    } catch (error){
      throw (error);
    }
  }



  
  



}
