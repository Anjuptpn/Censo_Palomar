import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Title } from '@angular/platform-browser';
import { BreakpointObserver  } from '@angular/cdk/layout';
import { FooterComponent } from '../../sections/footer/footer.component';
import { DialogService } from '../../sections/dialog/dialog.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, FooterComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent implements OnInit{
  private title = inject(Title);
  private breakpointObserver = inject(BreakpointObserver);
  public isSmallScreen: boolean = true;
  public dialog = inject(DialogService);

  ngOnInit(): void {
    this.breakpointObserver.observe('(max-width: 760px)').subscribe(result => {
      this.isSmallScreen = result.matches;
  });
  }

  mockupsNews = [
    {
      "titulo":"Noticia 1 de Ejemplo",
      "fecha":"24/06/2024",
      "imagen":"/assets/sinfoto.png",
      "categoria":"Cuidados",
    },
    {
      "titulo":"Esta es la noticia número 2 super grande titulo para ver como rompe el diseño",
      "fecha":"24/07/2024",
      "imagen":"/assets/sinfoto.png",
      "categoria":"Cuidados",
    },
    {
      "titulo":"Otra noticia más",
      "fecha":"08/06/2024",
      "imagen":"/assets/sinfoto.png",
      "categoria":"Cuidados",
    }
  ];

  constructor(){
    this.title.setTitle("Censo Palomar tu app de colombofilia");
  }
}
