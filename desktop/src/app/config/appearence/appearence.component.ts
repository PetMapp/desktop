import { Component } from '@angular/core';
import { MobileFooterComponent } from '../../components/mobile-footer/mobile-footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { AlternativeHeaderComponent } from '../../components/alternative-header/alternative-header.component';

@Component({
  selector: 'app-appearence',
  imports: [
    MobileFooterComponent,
    HeaderComponent,
    AlternativeHeaderComponent,
  ],
  templateUrl: './appearence.component.html',
  styleUrl: './appearence.component.scss'
})
export class AppearenceComponent {

}
