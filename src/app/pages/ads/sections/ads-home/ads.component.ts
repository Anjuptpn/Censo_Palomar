import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { AdsService } from '../../ads.service';
import { RouterLink } from '@angular/router';
import { FirebaseErrorsService } from '../../../../services/firebase-errors.service';
import { SnackbarService } from '../../../../shared/snackbar/snackbar.service';
import { CommonModule } from '@angular/common';
import { AdsInterface } from '../../../../models/ads.model';
import { ExtractWords } from '../../../../services/extract-words.pipe';

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [MatButton, RouterLink, CommonModule, ExtractWords],
  templateUrl: './ads.component.html',  
  styleUrls: ['./ads.component.sass', '../../../news/list-news/list-news.component.sass']
})
export class AdsComponent implements OnInit {
  private adsService = inject(AdsService);
  private readonly firebaseErrors = inject(FirebaseErrorsService);
  private readonly snackbar = inject(SnackbarService);

  adsList: AdsInterface[] = [];

  ngOnInit(): void {
    
    this.adsService.getLastestAds(3).then( res => {
      if (res != null){
        this.adsList = res;
      }
    }).catch ((error) => {
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string), 'cerrar', 8, 'snackbar-error');
    });
  }  
  

}
