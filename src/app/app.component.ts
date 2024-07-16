import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,            
            HeaderComponent,            
            MatSidenavModule],
  template: `<app-header></app-header>`,
  styles: ``
})
export class AppComponent {
  title = 'censo_palomar';
}
