import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Title } from '@angular/platform-browser';
import { FooterComponent } from '../../shared/footer/footer.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { NewsInterface } from '../../models/news.models';
import { AdsComponent } from '../ads/sections/ads-home/ads.component';
import { RouterLink } from '@angular/router';
import { NewsHomeComponent } from '../news/sections/news-home/news-home.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, FooterComponent, AdsComponent, NewsHomeComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent implements OnInit{
  private title = inject(Title);
  isSmallScreen: boolean = true;
  dialog = inject(DialogService);
  lastestNews: NewsInterface[] = [];
  

  ngOnInit(): void {    
    
  } 

  constructor(){
    this.title.setTitle("Censo Palomar tu app de colombofilia");
  }
}
