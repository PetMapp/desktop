import { Component } from '@angular/core';
import { MapViewComponent } from '../components/map-view/map-view.component';
import { HeaderComponent } from '../components/header/header.component';
import { MobileFooterComponent } from '../components/mobile-footer/mobile-footer.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MapViewComponent, HeaderComponent, MobileFooterComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {

}
