import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [MatButton, RouterLink, MatIcon],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.sass'
})
export class PanelComponent {

}
