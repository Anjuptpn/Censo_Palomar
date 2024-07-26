import { Component, inject, OnInit } from '@angular/core';
import { SpinnerService } from '../../../services/spinner.service';
import { AdsService } from '../ads.service';
import { CommonModule, Location } from '@angular/common';
import { FirebaseErrorsService } from '../../../services/firebase-errors.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { AdsInterface } from '../../../models/ads.model';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { ExtractWords } from '../../../services/extract-words.pipe';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-list-ads',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent, ExtractWords, MatButton],
  templateUrl: './list-ads.component.html',
  styleUrls: ['../../news/list-news/list-news.component.sass', './list-ads.component.sass']
})
export class ListAdsComponent implements OnInit{

  private readonly firebaseErrors = inject(FirebaseErrorsService);
  private readonly snackbar = inject(SnackbarService);
  private readonly adsService = inject(AdsService);
  private readonly spinnerService = inject(SpinnerService);
  private readonly location = inject(Location);

  adsList: AdsInterface[] = [];

  adsObservable: any;

  ngOnInit(): void {
    try{
      this.spinnerService.showLoading();
        this.adsObservable = this.adsService.getAdsFromFirebase().subscribe(res => {
          if (res){
            this.adsList = res;
          }
          this.spinnerService.stopLoading();
        });
    } catch (error){
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string), 'cerrar', 8, 'snackbar-error');
    }
  }

  ngOnDestroy(): void {
    this.adsObservable.unsubscribe();
  }

  goBack(){
    this.location.back();
  }

}
