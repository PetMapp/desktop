import { Component } from '@angular/core';
import { ButtonIconComponent } from '../iconButton/iconButton.component';

@Component({
  selector: 'app-mobile-footer',
  standalone: true,
  imports: [ButtonIconComponent],
  templateUrl: './mobile-footer.component.html',
  styleUrls: ['./mobile-footer.component.scss']  // <-- plural
})
export class MobileFooterComponent {

}
