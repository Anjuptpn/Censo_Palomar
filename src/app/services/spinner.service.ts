import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class SpinnerService {
  isSpinnerActive = new Subject<boolean>();

  showLoading():void{
    this.isSpinnerActive.next(true); //emite true
  }

  stopLoading():void{
    this.isSpinnerActive.next(false);
  } 

}
