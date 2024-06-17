import { Timestamp } from "@angular/fire/firestore";

export interface PigeonInterface{
    id: string;
    pigeonName: string;
    ring: string;
    birthday: Timestamp;
    gender: string;
    color: string;
    breed: string;
    state: string;
    registeredFather: boolean;
    father: string;
    registeredMother: boolean;
    mother: string;
    image: string;
    notes: string; 
    registerDate: Timestamp;    
}