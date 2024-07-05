import { Component, inject, OnInit } from '@angular/core';
import { NewsInterface } from '../../../models/news.models';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsService } from '../news.service';
import { FirebaseErrorsService } from '../../auth/services/firebase-errors.service';
import { SnackbarService } from '../../../sections/snackbar/snackbar.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { FooterComponent } from '../../../sections/footer/footer.component';
import { AdminBarNewsComponent } from '../../admin/sections/admin-bar-news/admin-bar-news.component';

@Component({
  selector: 'app-view-news',
  standalone: true,
  imports: [CommonModule, MatIcon, MatButton, RouterLink, FooterComponent, AdminBarNewsComponent],
  templateUrl: './view-news.component.html',
  styleUrl: './view-news.component.sass'
})
export class ViewNewsComponent implements OnInit{

  private activatedRoute = inject(ActivatedRoute);
  private newsService = inject(NewsService);
  private firebaseErrors = inject(FirebaseErrorsService);
  private snackbar = inject(SnackbarService);

  currentNews: NewsInterface | null = null;
  newsId: string = '';
  currentSubscription: any;
  

  ngOnInit(): void {
    this.newsId = this.activatedRoute.snapshot.params['id'];
    this.newsService.getNewsWithId(this.newsId).then( (response) => {
        this.currentNews = response as NewsInterface;
      }).catch(error =>  this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string), 'cerrar', 8, 'snackbar-error'));
  }
}
