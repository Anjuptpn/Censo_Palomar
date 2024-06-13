import { Timestamp } from "@angular/fire/firestore";

export interface UserInterface{
    id: string;
    name: string;
    email: string;
    club: string;
    registerDate: Timestamp;
    rol: 'colombofilo',
    password: string;
    policy: boolean;
    urlImage: string;
}