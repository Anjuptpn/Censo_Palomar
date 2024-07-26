import { Injectable } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatesService {


  createFirebaseTimestamp(date: Date, hour: string, minutes: string, seconds: string): Timestamp | null{
    if (hour == null || minutes == null || seconds == null || date == null){
      return null;
    }    
    const partsDate = date.toLocaleString('es-Es').split('/');
    let stringDate = partsDate[2].split(',')[0] + '-' + this.fillWithZeros(partsDate[1], 2) + '-' + 
          this.fillWithZeros(partsDate[0], 2) + 'T' + hour + ":" + minutes + ":" + seconds + ".000";
    return Timestamp.fromDate(new Date(stringDate));
  }

  calculateDatesDifference(finishdate: Timestamp | null, startDate: Timestamp | null){
    if (finishdate == null || startDate == null){
      return null
    }
    return (finishdate.toMillis() - startDate.toMillis())/60000;
  }

  convertSecondsToHourMinutesAndSeconds(mins: number | null | undefined): string | null{
    if (mins == null || undefined){
      return null
    }
    const seconds = mins*60;

    const hour = String (Math.floor(seconds/3600));
    const minutes = String (Math.floor((seconds / 60) % 60));
    const calculateSeconds = String (Math.floor(seconds % 60));

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

  calculateSpeed(distance: number | null, time: number | null): number | null{
    if (distance == null || time == null){
      return null;
    }
    if (distance == 0 || time == 0){
      return 0;
    }
    return distance/time;

  }

  separateDateComponents(timestamp: Timestamp | null | undefined){
    if (timestamp == null || timestamp == undefined){
      return null;
    }
    let date = new Date (timestamp.toMillis());
    const objectDate = {
      date : date,
      hour: this.fillWithZeros(date.getHours().toString() as string, 2) ,
      minutes: this.fillWithZeros(date.getMinutes().toString(), 2),
      seconds: this.fillWithZeros(date.getSeconds().toString(), 2)
    };
    return objectDate;
  }

}
