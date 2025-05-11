import { Component, OnInit } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    // Esperar um momento para garantir que o DOM esteja pronto
    setTimeout(() => {
      // Criação do mapa com coordenadas do Rio de Janeiro
      const map = L.map('map', {
        center: [-22.9068, -43.1729],
        zoom: 13,
        zoomControl: true,
        preferCanvas: false,
      });

      // Adicionar camada do OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Adicionar marcador no mapa no Rio de Janeiro
      L.marker([-22.9068, -43.1729]).addTo(map)
        .bindPopup('Rio de Janeiro!')
        .openPopup();
    }, 100);
  }
}