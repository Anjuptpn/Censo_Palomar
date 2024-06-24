import { Injectable } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatesService {

  constructor() { }

  createFirebaseTimestamp(date: Date, hour: string, minutes: string, seconds: string){
    if (hour == null || minutes == null || seconds == null){
      return null;
    }
    if (date == null){
      return null;
    }
    const partsDate = date.toLocaleString('es-Es').split('/');
    let stringDate = partsDate[2].split(',')[0] + '-' + this.fillWithZeros(partsDate[1], 2) + '-' + 
          this.fillWithZeros(partsDate[0], 2) + 'T' + hour + ":" + minutes + ":" + seconds + ".000";
    return Timestamp.fromDate(new Date(stringDate));
  }

  calculateDatesDifference(date1: Timestamp | null, date2: Timestamp | null){
    if (date1 == null || date2 == null){
      return null
    }
    return (date1.toMillis() - date2.toMillis())/60000;
  }

  convertirSegundosAHorasMinutosYSegundos(seconds: number | null){
    if (seconds == null){
      return null
    }
    const hour = String (Math.floor(seconds/3600));
    const minutes = String (Math.floor((seconds / 60) % 60));
    const calculateSeconds = String (seconds % 60);

    return this.fillWithZeros(hour, 2) + ':' + this.fillWithZeros(minutes, 2)
                      +':'+this.fillWithZeros(calculateSeconds, 2);
  }

  private fillWithZeros (data: string, lengthString: number): string{
    if (data.length < lengthString){
      return this.fillWithZeros("0"+data, lengthString);
    } else {
      return data;
    }
  }

  getCurrentDate(): Timestamp{
    return Timestamp.fromDate(new Date());
  }

  calculateSpeed(distance: number | null, time: number | null){
    if (distance == null || time == null){
      return null;
    }
    if (distance == 0 || time == 0){
      return 0;
    }
    return distance/time;

  }

  // Añade mucha más complejidad al problema de lo que soluciona se descarta.
  // addTimeZoneOffset(date: Date): Date{
  //   if (date.toISOString().indexOf('Z') != -1){
  //     const stringDate = date.toISOString().split('Z');
  //     const timezoneOffset = date.getTimezoneOffset();
  //     const isPositive = timezoneOffset >= 0 ? '+' : '-';
  //     return new Date(stringDate[0]+
  //                       isPositive+
  //                       this.fillWithZeros(String(Math.abs(timezoneOffset) / 60), 2)+":00");

  //   } else {
  //     return date;
  //   }

  // }


}
