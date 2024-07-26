import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdsService } from '../ads.service';
import { FirebaseErrorsService } from '../../../services/firebase-errors.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { SpinnerService } from '../../../services/spinner.service';
import { AuthService } from '../../../services/auth.service';
import { AdsInterface } from '../../../models/ads.model';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { MatButton } from '@angular/material/button';
import { CdkAccordionModule } from '@angular/cdk/accordion';

@Component({
  selector: 'app-advertisement',
  standalone: true,
  imports: [MatIcon, CommonModule, RouterLink, FooterComponent, MatButton, CdkAccordionModule],
  templateUrl: './advertisement.component.html',
  styleUrl: './advertisement.component.sass'
})
export class AdvertisementComponent implements OnInit{
  expandedIndex = 0;

  private activatedRoute = inject(ActivatedRoute);
  private adsService = inject(AdsService);
  private firebaseErrors = inject(FirebaseErrorsService);
  private snackbar = inject(SnackbarService);
  private spinnerService = inject(SpinnerService);
  private authService = inject(AuthService);

  currentAd: AdsInterface | null = null;
  adsId: string = '';
  currentSubscription: any;

  ngOnInit(): void {
    this.spinnerService.showLoading();
    this.adsId = this.activatedRoute.snapshot.params['id'];
    if (this.adsId != null && this.adsId != undefined) {
      this.adsService.getAdById(this.adsId).then( ads => {
        this.currentAd = ads;
      }).catch( (error) =>
        this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                     'cerrar', 8, 'snackbar-error')
      ).finally(
        () => this.spinnerService.stopLoading()
      );
    } else {
      this.snackbar.showSnackBar('Ha habido un error al leer el anuncio vuelve hacia atrás y reinténtalo',
                     'cerrar', 8, 'snackbar-error')
    }
  }

}
