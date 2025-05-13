import { Component } from '@angular/core';
import { MapViewComponent } from '../components/map-view/map-view.component';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MapViewComponent, HeaderComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {

}
