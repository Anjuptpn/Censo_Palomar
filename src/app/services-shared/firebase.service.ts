import { Injectable, inject } from '@angular/core';
import { Firestore, WhereFilterOp, collection, collectionData, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

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

  // getCollectionFromFirebase<collectionType>(path: string): Observable<collectionType[]>{
  //   try{
  //     const dataCollection = collection(this.firestore, path);
  //     return collectionData(dataCollection) as Observable<collectionType[]>;
  //   } catch (error){
  //     throw (error);
  //   }

  // }
  //versión mejorada para obtener datos ordenados por id (Fecha de registro en la mayoría de los casos).
  getCollectionFromFirebase<collectionType>(path: string): Observable<collectionType[]>{
    try{
      const dataCollection = collection(this.firestore, path);
      const queryToDo = query(dataCollection, orderBy('id', 'desc'));
      let collectionResult: collectionType[];
      return from(getDocs(queryToDo).then( (result) => {
        collectionResult =  result.docs.map(doc => doc.data() as collectionType); 
        return collectionResult;       
      }));  
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

  async getLastest(numberNews: number, path: string){
    try{
      const dataCollection = collection(this.firestore, path);
      const lasts = query(dataCollection, orderBy('id', 'desc'), limit(numberNews));
      return await getDocs(lasts);
    } catch (error){
      throw (error);
    }
  }

  async getDocumentsWithQuery(path: string, field: string, simbol: WhereFilterOp, condition: string){
    try{
      const dataCollection = collection(this.firestore, path);
      const queryToMake = query(dataCollection, where(field, simbol, condition));
      return await getDocs(queryToMake);
    } catch (error){
      throw (error);
    }
  }



  
  



}
