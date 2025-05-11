import { Component } from '@angular/core';
import { MapViewComponent } from '../components/map-view/map-view.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MapViewComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {

}
