import { Component, Input } from '@angular/core';
import { User } from '@angular/fire/auth';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-competitions-list',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './competitions-list.component.html',
  styleUrl: './competitions-list.component.sass'
})
export class CompetitionsListComponent {
  @Input() currentUser!: User | null;
  @Input() pigeonId!: string;

  mockCompetitions = [
    {
      "ranking": "105",
      "competitionName":"Suelta Puerto Calero",
      "competitionPlace":"Puerto Calero (Lanzarote)",
      "competitionType": "Velocidad",
      "competitonDate": "24/09/2020",
      "competitionTime": "08:30",
      "arriveDate": "24/09/2020",
      "arriveTime": "16:30",
      "distance": "876541",
      "speed": "1458.99",
      "points": "340",
      "id": "328684762384.029374019273409.ranking",
    },
    {
      "ranking": "105",
      "competitionName":"Suelta Social",
      "competitionPlace":"Sardina del norte",
      "competitionType": "Velocidad",
      "competitonDate": "22/04/2021",
      "competitionTime": "08:36",
      "arriveDate": "22/04/2021",
      "arriveTime": "09:30",
      "distance": "80",
      "speed": "1458.99",
      "points": "120",
      "id": "3223424762384.0293742432429.ranking",
    },
    {
      "ranking": "40",
      "competitionName":"Campeonato de Canarias",
      "competitionPlace":"Alta Mar",
      "competitionType": "Gran Fondo",
      "competitonDate": "04/03/2022",
      "competitionTime": "08:00",
      "arriveDate": "04/03/2022",
      "arriveTime": "20:37",
      "distance": "900",
      "speed": "1258.99",
      "points": "560",
      "id": "3223424762384.0293742432429.ranking",
    }
  ];

}
