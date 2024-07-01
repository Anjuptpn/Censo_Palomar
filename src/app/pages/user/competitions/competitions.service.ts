import { Injectable } from '@angular/core';
import { FirebaseService } from '../../../services-shared/firebase.service';
import { CompetitionInterface } from '../../../models/competition.model';


@Injectable({
  providedIn: 'root'
})
export class CompetitionsService {


  constructor(private firebaseService: FirebaseService) { }

  async getCompetitionWithId(userId: string, pigeonId: string, competitionId: string){
    try{
      const path = 'usuarios/'+userId+'/palomas/'+pigeonId+'/competiciones';
    let competition: CompetitionInterface = await this.firebaseService.getDocumentFromFirebase(competitionId, path).then( response => {
      return response.data() as CompetitionInterface;
    });
    return competition;

    }catch (error){
      throw (error);
    }
  }

  async registerCompetitionInFirestore(userId: string, pigeonId: string, competition: CompetitionInterface){    
    try{
      const path = 'usuarios/'+userId+'/palomas/'+pigeonId+'/competiciones';
      await this.firebaseService.saveInFirestore(competition, path, competition.id);
    } catch (error){
      throw(error);
    }    
  }

  async updateCompetition (userId: string, pigeonId: string, competition: CompetitionInterface){
    try{
      const path = 'usuarios/'+userId+'/palomas/'+pigeonId+'/competiciones';
      await this.firebaseService.updateDocumentInFirestore(competition, path, competition.id);
    } catch (error){
      throw(error);
    }
  }

  async deleteCompetition (userId: string, pigeonId: string, competitionId: string){
    try{
      const path = 'usuarios/'+userId+'/palomas/'+pigeonId+'/competiciones/'+competitionId;
      await this.firebaseService.deleteDocumentInFirestore(path);
    } catch (error){
      throw(error);
    }
  }
}
