import { Timestamp } from "@angular/fire/firestore";

export interface AdsInterface{
    id: string;
    title: string;
    details: string;
    price: number;
    contact: string;
    userId: string;
    image: string;
    publishDate: Timestamp;
}