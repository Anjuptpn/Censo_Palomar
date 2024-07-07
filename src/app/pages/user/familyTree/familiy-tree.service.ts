import { Injectable } from '@angular/core';
import { FirebaseService } from '../../../services-shared/firebase.service';
import { PigeonInterface } from '../../../models/pigeon.model';

@Injectable({
  providedIn: 'root'
})
export class FamiliyTreeService {

  constructor(private readonly firebase: FirebaseService) { }

  /*async getParents (pigeon: string, userId: string, level: number): Promise<(string | PigeonInterface)[]>{
    let parents: (string | PigeonInterface)[] = [];
    if (level > 2){
      return parents;
    }
    try{      
        let currentPigeon = await this.firebase.getDocumentFromFirebase(pigeon, 'usuarios/'+userId+'/palomas').then(
          response => {return response.data() as PigeonInterface;}
        );
        parents.push("Nombre: "+currentPigeon.pigeonName+" Nivel --> "+level);
        let mother: (string | PigeonInterface)[] = [];
        let father: (string | PigeonInterface)[] = [];
        if (currentPigeon.registeredMother && currentPigeon.motherId != null && currentPigeon.motherId != ''){
          mother = await this.getParents(currentPigeon.motherId, userId, level + 1);
        } else if (currentPigeon.mother != null && currentPigeon.mother != '' && level < 2){
          mother.push("Nombre: "+currentPigeon.mother+" Nivel --> "+level);
        } else if (level < 2){
            mother.push('Berremda --> '+ level + " Nombre: "+currentPigeon.pigeonName );
        }

        if (currentPigeon.registeredFather && currentPigeon.fatherId != null && currentPigeon.fatherId != ''){
          father = await this.getParents(currentPigeon.fatherId, userId, level + 1);
        } else if (currentPigeon.father != null && currentPigeon.father != '' && level < 2){
          father.push("Nombre: "+currentPigeon.father+" Nivel --> "+level);
        } else {
          father.push('Barracuda --> '+level+" Nombre: "+currentPigeon.pigeonName);
        }        
        parents = parents.concat(mother, father);      
      console.log("Level --> "+level, parents);       
      return parents;
    }catch(error){      
      console.log(error);
      return [];
    }
  }*/
  
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
      // }  else if (mother != null ){
      //   familyArray[index] = mother;
      //   console.log("Madre registrado", mother, index);
      } 
      let father = await this.fillArrayWithParents(currentPigeon.fatherId, path, 2*index+2, nodes, familyArray);
      if (father == ''){
        if (currentPigeon.father != null && currentPigeon.father != undefined){
          familyArray[2*index+2] = currentPigeon.father;
          console.log("Padre sin registar", currentPigeon.father, index);
        } 
      // }  else if (father != null ){
      //   familyArray[index] = father;
      //   console.log("Padre registrado", father, index);
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

  //Un árbol binario tiene 2^n - 1 hijos donde n es la profundidad del árbol
  //Un número potencia de dos en binario sólo tiene 1 bit ejemplo (8 = 1000) y su numero anterior todo unos (7 = 0111)
  //Al hacer un And lógico si el valor es 0 es potencia de dos. 
    
}
