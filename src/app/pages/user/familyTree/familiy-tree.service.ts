import { Injectable } from '@angular/core';
import { FirebaseService } from '../../../services-shared/firebase.service';
import { PigeonInterface } from '../../../models/pigeon.model';

@Injectable({
  providedIn: 'root'
})
export class FamiliyTreeService {

  constructor(private readonly firebase: FirebaseService) { }
  
  async fillArrayWithParents (pigeon: string, path: string, index: number, nodes: number, familyArray: (string | PigeonInterface)[]): Promise<any>{
    if (index >= nodes) return;
    if (pigeon == null || pigeon == '' || pigeon == undefined) return '';
    try{      
      let currentPigeon = await this.firebase.getDocumentFromFirebase(pigeon, path).then(
        response => {return response.data() as PigeonInterface;}
      );  
      familyArray[index]=currentPigeon; 
      let mother = await this.fillArrayWithParents(currentPigeon.motherId, path, 2*index+1, nodes, familyArray);
      if (mother == ''){
        if (currentPigeon.mother != null && currentPigeon.mother != undefined){
          familyArray[2*index+1] = currentPigeon.mother;
          console.log("MAdre sin registar", currentPigeon.mother, index);
        } 
      } 
      let father = await this.fillArrayWithParents(currentPigeon.fatherId, path, 2*index+2, nodes, familyArray);
      if (father == ''){
        if (currentPigeon.father != null && currentPigeon.father != undefined){
          familyArray[2*index+2] = currentPigeon.father;
          console.log("Padre sin registar", currentPigeon.father, index);
        }
      } 
    } catch (error){
      throw(error);
    }
    
  }
  
  async getParents (pigeon: string, userId: string, nodes: number){
    if (this.levelIsValid(nodes)){
      try{
        let familyArray = new Array(nodes).fill('');
        await this.fillArrayWithParents(pigeon, 'usuarios/'+userId+'/palomas', 0, nodes, familyArray);
        return familyArray;
      } catch (error){
        throw(error);
      }      
    } else{
      return [];
    }

    
  }

  private levelIsValid(level: number): boolean{
    if (level < 0) return false; //Número negativos
    return (((level + 1) & level) === 0); //Combrobamos que level+1 es potencia de 2
  }

    
}
