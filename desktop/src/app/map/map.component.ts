import { Component, ViewChild } from '@angular/core';
import { MapViewComponent } from '../components/map-view/map-view.component';
import { HeaderComponent } from '../components/header/header.component';
import { MobileFooterComponent } from '../components/mobile-footer/mobile-footer.component';
import { FloatingComponent } from '../components/floating/floating.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MapViewComponent, HeaderComponent, MobileFooterComponent, FloatingComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  @ViewChild(MapViewComponent) mapView!: MapViewComponent;

  searchLocation(query: string) {
    console.log('Evento search recebido no MapComponent:', query);
    this.mapView?.searchLocation(query);
  }
}
