import { Injectable, inject } from '@angular/core';
import { Firestore, WhereFilterOp, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private firestore = inject(Firestore);

  async saveInFirestore(dataCollection: any, path: string, id: string){
    try{
      const document = doc(this.firestore, path, id);
      return await setDoc(document, dataCollection);
    } catch (error){
      throw (error);
    }
  }

  async getDocumentFromFirebase(id: string, path: string){
    try{
      const document = doc(this.firestore, path, id);
      return await getDoc(document);
    } catch (error){
      throw (error);
    }
  }
  
  getCollectionFromFirebase<collectionType>(path: string): Observable<collectionType[]>{
    try{
      const dataCollection = collection(this.firestore, path);
      const queryToDo = query(dataCollection, orderBy('id', 'desc'));
      let collectionResult: collectionType[];
      return from(getDocs(queryToDo).then( (result) => {
        return result.docs.map(doc => doc.data() as collectionType);        
      }));  
    } catch (error){
      throw (error);
    }
  }

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

  async getDocumentsWithQuery(
        path: string, 
        field: string, 
        comparation: WhereFilterOp, 
        condition: string, 
        order: string){
    try{
      const dataCollection = collection(this.firestore, path);
      const queryToMake = query(dataCollection, where(field, comparation, condition), orderBy(order, 'asc'));
      return await getDocs(queryToMake);
    } catch (error){
      throw (error);
    }
  }



  
  



}
