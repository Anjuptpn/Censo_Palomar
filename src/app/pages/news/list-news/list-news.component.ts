import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NewsService } from '../news.service';
import { NewsInterface } from '../../../models/news.models';
import { ExtractWords } from '../../../services-shared/extract-words.pipe';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../../sections/footer/footer.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-list-news',
  standalone: true,
  imports: [ExtractWords, CommonModule, RouterLink, FooterComponent, MatButton ],
  templateUrl: './list-news.component.html',
  styleUrl: './list-news.component.sass'
})
export class ListNewsComponent implements OnInit, OnDestroy{

  private newsService = inject(NewsService);
  newsList: NewsInterface[] = [];
  newsObservable: any;
  
  ngOnInit(): void {
    this.newsObservable = this.newsService.getNewsFromFirebase().subscribe(res => {
      if (res){
        this.newsList = res;
      }
    });
  }

  ngOnDestroy(): void {
    this.newsObservable.unsubscribe;
  }

}
