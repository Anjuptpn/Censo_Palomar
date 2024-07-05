import { Timestamp } from "@angular/fire/firestore";

export interface NewsInterface{
    id: string;
    title: string;
    body: string;
    category: string;
    image: string;
    publishDate: Timestamp;
}