import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectorRef, ElementRef, HostListener, OnInit } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { IconComponent } from '../icon-component/icon-component.component';

import {
  BrnSheetComponent,
  BrnSheetContentDirective,
  BrnSheetTriggerDirective
} from '@spartan-ng/brain/sheet';
import {
  HlmSheetComponent,
  HlmSheetContentComponent,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetTitleDirective
} from '@spartan-ng/ui-sheet-helm';

import { ApiServiceService } from '../../services/api-service.service';
import { PetLocationModel } from '../../models/pet-location-model';
import { PetdetailDTORes } from '../../interfaces/DTOs/petdetail-dto-res';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [
    CommonModule,
    LeafletModule,
    BrnSheetComponent,
    BrnSheetContentDirective,
    BrnSheetTriggerDirective,
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetHeaderComponent,
    HlmSheetTitleDirective,
    HlmSheetDescriptionDirective,
    HlmSheetFooterComponent,
    HlmButtonDirective,
    IconComponent
  ],
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements AfterViewInit {
  @ViewChild('sheet', { static: true }) sheet!: BrnSheetComponent;
  @ViewChild('hiddenTrigger', { static: false }) hiddenTrigger!: ElementRef;

  public petDetail: PetdetailDTORes | null = null;
  private map!: L.Map;
  public isMobile = false;

  constructor(
    private api: ApiServiceService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  async ngAfterViewInit() {
    // Aguarda um tick para garantir que a view foi inicializada
    setTimeout(async () => {
      this.initMap();
      await this.loadPetMarkers();
      this.setupLocationHandlers();
    }, 100); // Aumentei o timeout
  }

  private initMap() {
    this.map = L.map('map', {
      center: [-22.9068, -43.1729],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);
    setTimeout(() => this.map.invalidateSize(), 200);
  }

  async searchLocation(query: string) {
    if (!query) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.length === 0) {
        alert('Local não encontrado!');
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      this.map.setView([lat, lon], 13);

    } catch (error) {
      console.error('Erro na busca:', error);
      alert('Erro ao buscar o local.');
    }
  }

  private setupLocationHandlers() {
    this.map.locate({ setView: false, maxZoom: 16 });
    this.map.on('locationfound', (e: L.LocationEvent) => {
      this.map.setView(e.latlng, 16);
    });
    this.map.on('locationerror', err => {
      console.warn('Erro ao obter localização:', err.message);
    });
  }

  private async loadPetMarkers() {
    try {
      const pets = (await this.api.get<PetLocationModel[]>(
        'pet/location/all',
        /* anonymous=*/ true,
      )) ?? [];

      pets.forEach(pet => {
        if (typeof pet.lat !== 'number' || typeof pet.lng !== 'number') {
          console.warn('Coords inválidas para pet:', pet);
          return;
        }

        const html = `
          <div class="pet-marker">
            <img src="${pet.petImage}" alt="Pet ${pet.petId}" />
          </div>
        `;
        const icon = L.divIcon({
          className: 'custom-div-icon',
          html,
          iconSize: [50, 50],
          iconAnchor: [25, 50],
        });

        L.marker([pet.lat, pet.lng], { icon })
          .addTo(this.map)
          .on('click', async () => {
            await this.handleMarkerClick(pet.petId);
          });
      });
    } catch (error) {
      console.error('Erro ao carregar marcadores:', error);
    }
  }

  private async handleMarkerClick(petId: string | number) {
    try {
      console.log('Clique no marker, petId:', petId);

      // Busca os detalhes do pet
      const petDetail = await this.api.get<PetdetailDTORes>(
        `/pet/find/get/${petId}`,
        true
      );

      if (petDetail) {
        console.log('Detalhes do pet carregados:', petDetail);

        // Executa dentro do NgZone para garantir que o Angular detecte as mudanças
        this.ngZone.run(() => {
          this.petDetail = petDetail;

          // Força detecção de mudanças imediata
          this.cdr.detectChanges();

          // Tentativa 1: Abrir diretamente
          setTimeout(() => {
            if (this.sheet) {
              console.log('Tentativa 1: Abrindo sheet diretamente...');
              this.sheet.open();
            }
          }, 50);

          // Tentativa 2: Usar o trigger escondido
          setTimeout(() => {
            if (this.hiddenTrigger && this.hiddenTrigger.nativeElement) {
              console.log('Tentativa 2: Clicando no trigger escondido...');
              this.hiddenTrigger.nativeElement.click();
            }
          }, 100);

          // Tentativa 3: Abrir após mais tempo
          setTimeout(() => {
            if (this.sheet) {
              console.log('Tentativa 3: Abrindo sheet após delay maior...');
              this.sheet.open();
            }
          }, 200);
        });
      } else {
        console.warn('Detalhes do pet retornaram null para petId:', petId);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do pet:', error);
    }
  }

  public closeSheet() {
    if (this.sheet) {
      this.sheet.close();
    }
    this.petDetail = null;
  }

  // Método para debug - você pode chamar no template
  public openSheetManually() {
    console.log('Debug: Tentando abrir sheet manualmente');
    console.log('Sheet exists:', !!this.sheet);
    console.log('PetDetail exists:', !!this.petDetail);

    if (this.sheet) {
      this.sheet.open();
    } else {
      console.error('Sheet não está disponível');
    }
  }

  // Método alternativo usando trigger
  public openSheetViaTrigger() {
    console.log('Debug: Tentando abrir via trigger');
    if (this.hiddenTrigger && this.hiddenTrigger.nativeElement) {
      this.hiddenTrigger.nativeElement.click();
    } else {
      console.error('Trigger não está disponível');
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }
}