import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NewsInterface } from '../../../models/news.models';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsService } from '../news.service';
import { FirebaseErrorsService } from '../../../services/firebase-errors.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { AdminBarNewsComponent } from '../../admin/sections/admin-bar-news/admin-bar-news.component';
import { SpinnerService } from '../../../services/spinner.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-view-news',
  standalone: true,
  imports: [CommonModule, MatIcon, MatButton, RouterLink, FooterComponent, AdminBarNewsComponent],
  templateUrl: './view-news.component.html',
  styleUrl: './view-news.component.sass'
})
export class ViewNewsComponent implements OnInit, OnDestroy{

  private activatedRoute = inject(ActivatedRoute);
  private newsService = inject(NewsService);
  private firebaseErrors = inject(FirebaseErrorsService);
  private snackbar = inject(SnackbarService);
  private spinnerService = inject(SpinnerService);
  private authService = inject(AuthService);
  
  currentNews: NewsInterface | null = null;
  newsId: string = '';
  currentSubscription: any;
  isAdmin = false;
  authsubscription: any;
  
  ngOnInit(): void {
    this.spinnerService.showLoading();
    this.authsubscription = this.authService.currentUserState.subscribe( user => {
      if (user != null){        
        this.authService.isAdminUser(user).then( isAdmin => {
          this.isAdmin = isAdmin;
        });
      } else {
        this.isAdmin = false;
      }
    });
    this.newsId = this.activatedRoute.snapshot.params['id'];
    this.newsService.getNewsWithId(this.newsId).then( (response) => {
        this.currentNews = response as NewsInterface;
        this.spinnerService.stopLoading();
      }).catch(error =>  {
        this.spinnerService.stopLoading();
        this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string), 'cerrar', 8, 'snackbar-error');
      });
  }

  ngOnDestroy(): void {
    this.authsubscription.unsubscribe();
    
  }
}
