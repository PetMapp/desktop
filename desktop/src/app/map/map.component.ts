import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MapViewComponent } from '../components/map-view/map-view.component';
import { HeaderComponent } from '../components/header/header.component';
import { MobileFooterComponent } from '../components/mobile-footer/mobile-footer.component';
import { FloatingComponent } from '../components/floating/floating.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MapViewComponent, HeaderComponent, MobileFooterComponent, FloatingComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  @ViewChild(MapViewComponent) mapView!: MapViewComponent;

  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      const searchQuery = params['search'];
      if (searchQuery) {
        console.log('Pesquisando localização via query param:', searchQuery);
        this.searchLocation(searchQuery);
      }
    });
  }

  searchLocation(query: string) {
    console.log('Evento search recebido no MapComponent:', query);
    this.mapView?.searchLocation(query);
  }

  recenterMap() {
    this.mapView?.locateUser();
  }
}
