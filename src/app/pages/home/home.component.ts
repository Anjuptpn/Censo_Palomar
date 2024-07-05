import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Title } from '@angular/platform-browser';
import { FooterComponent } from '../../sections/footer/footer.component';
import { DialogService } from '../../sections/dialog/dialog.service';
import { NewsInterface } from '../../models/news.models';
import { AdsComponent } from './sections/ads/ads.component';
import { NewsHomeComponent } from './sections/news-home/news-home.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, FooterComponent, AdsComponent, NewsHomeComponent],
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
