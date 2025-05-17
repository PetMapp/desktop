import { Component, AfterViewInit } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import { ApiServiceService } from '../../services/api-service.service';
import { PetLocationModel } from '../../models/pet-location-model';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements AfterViewInit {
  private map!: L.Map;

  constructor(private api: ApiServiceService) { }

  async ngAfterViewInit() {
    // 1) Cria o mapa
    this.map = L.map('map', {
      center: [-22.9068, -43.1729],
      zoom: 13,
      zoomControl: false,
      preferCanvas: false,
      attributionControl: false,
    });

    // 2) Layer base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    L.control.attribution({
      position: 'bottomright',
      prefix: false    // <<< tira o link “Leaflet” e a bandeirinha
    }).addTo(this.map);

    // 3) Força o Leaflet a recalcular o tamanho do div
    setTimeout(() => this.map.invalidateSize(), 200);

    // 4) Carrega os pets e adiciona os markers
    await this.loadPetMarkers();

    // 5) Tenta obter localização e recentrar (sem bloquear markers)
    this.map.locate({ setView: false, maxZoom: 16 });
    this.map.on('locationfound', (e: L.LocationEvent) => {
      this.map.setView(e.latlng, 16);
    });
    this.map.on('locationerror', err => {
      console.warn('Erro ao obter localização:', err.message);
    });
  }

  private async loadPetMarkers() {
    const pets: PetLocationModel[] = (await this.api.get<PetLocationModel[]>(
      'pet/location/all',
    /* anonymous=*/ true
    )) ?? [];

    pets.forEach(pet => {
      if (typeof pet.lat !== 'number' || typeof pet.lng !== 'number') {
        console.warn('Coords inválidas para pet:', pet);
        return;
      }

      // Criamos um DivIcon com HTML customizado
      const html = `
      <div class="pet-marker">
        <img src="${pet.petImage}" alt="Pet ${pet.petId}" />
      </div>
    `;

      const icon = L.divIcon({
        className: 'custom-div-icon', // remove as classes padrões
        html,
        iconSize: [50, 50],
        iconAnchor: [25, 50],  // base do círculo
        popupAnchor: [0, -45]
      });

      L.marker([pet.lat, pet.lng], { icon })
        .addTo(this.map)
        .on('click', () => {
          console.log(`Clicou no pet ${pet.petId}`);
        });
    });
  }
}
