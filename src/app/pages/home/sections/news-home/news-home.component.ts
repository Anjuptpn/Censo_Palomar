import { Component, inject, OnInit } from '@angular/core';
import { NewsService } from '../../../news/news.service';
import { NewsInterface } from '../../../../models/news.models';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-news-home',
  standalone: true,
  imports: [CommonModule, MatButton, RouterLink],
  templateUrl: './news-home.component.html',
  styleUrl: './news-home.component.sass'
})
export class NewsHomeComponent implements OnInit{

  private newsService = inject(NewsService);
  latestNews: NewsInterface[] = [];

  ngOnInit(): void {
    this.newsService.getLastestNews(3).then( (result) => {
      this.latestNews = result;        
      }).catch( error => {
        this.latestNews = [];
      });    
  }



}
