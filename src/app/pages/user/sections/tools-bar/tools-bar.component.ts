import { Component, Input } from '@angular/core';
import { User } from '@angular/fire/auth';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tools-bar',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './tools-bar.component.html',
  styleUrl: './tools-bar.component.sass'
})
export class ToolsBarComponent {
  @Input() currentUser!: User | null;
  @Input() pigeonId!: string;
}
