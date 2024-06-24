import { Timestamp } from "@angular/fire/firestore";

export interface CompetitionInterface
{
    ranking: number, 
    competitionName: string, 
    competitionPlace: string, 
    competitionType: string, 
    competitionDate: Timestamp | null,
    arriveDate: Timestamp | null,
    duration: number | null,
    distance: number, 
    speed: number | null,
    points: number, 
    id: string,
    notes: string, 
    registerDate: Timestamp,  
}