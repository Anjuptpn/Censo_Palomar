import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NewsService } from '../news.service';
import { NewsInterface } from '../../../models/news.models';
import { ExtractWords } from '../../../services/extract-words.pipe';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { MatButton } from '@angular/material/button';
import { SpinnerService } from '../../../services/spinner.service';
import { FirebaseErrorsService } from '../../../services/firebase-errors.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-list-news',
  standalone: true,
  imports: [ExtractWords, CommonModule, RouterLink, FooterComponent, MatButton ],
  templateUrl: './list-news.component.html',
  styleUrl: './list-news.component.sass'
})
export class ListNewsComponent implements OnInit, OnDestroy{

  private readonly newsService = inject(NewsService);
  private readonly spinnerService = inject(SpinnerService);
  private readonly firebaseErrors = inject(FirebaseErrorsService);
  private readonly snackbar = inject(SnackbarService);
  newsList: NewsInterface[] = [];
  newsObservable: any;
  
  ngOnInit(): void {
    try{
      this.spinnerService.showLoading();
      this.newsObservable = this.newsService.getNewsFromFirebase().subscribe(res => {
        if (res){
          this.newsList = res;
        }
        this.spinnerService.stopLoading();
      });
    } catch (error){
      this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string), 'cerrar', 8, 'snackbar-error');
    }
  }

  ngOnDestroy(): void {
    this.newsObservable.unsubscribe();
  }

}
