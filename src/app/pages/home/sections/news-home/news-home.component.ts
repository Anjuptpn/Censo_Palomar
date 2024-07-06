import { Component, inject, OnInit } from '@angular/core';
import { NewsService } from '../../../news/news.service';
import { NewsInterface } from '../../../../models/news.models';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SpinnerService } from '../../../../services-shared/spinner.service';

@Component({
  selector: 'app-news-home',
  standalone: true,
  imports: [CommonModule, MatButton, RouterLink],
  templateUrl: './news-home.component.html',
  styleUrl: './news-home.component.sass'
})
export class NewsHomeComponent implements OnInit{

  private newsService = inject(NewsService);
  private spinnerService = inject(SpinnerService);
  latestNews: NewsInterface[] = [];

  ngOnInit(): void {
    this.spinnerService.showLoading();
    this.newsService.getLastestNews(3).then( (result) => {
      this.latestNews = result;
      this.spinnerService.stopLoading();        
      }).catch( error => {
        this.spinnerService.stopLoading();
        this.latestNews = [];
      });    
  }



}
