import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardComponent } from '../../atoms/card/card.component';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-upgrade-card',
  standalone: true,
  imports: [CardComponent, ButtonComponent],
  templateUrl: './upgrade-card.component.html',
  styleUrl: './upgrade-card.component.css'
})
export class UpgradeCardComponent {

}
