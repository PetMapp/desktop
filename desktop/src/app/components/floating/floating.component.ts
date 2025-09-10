import {
  Component,
  AfterViewInit,
  OnDestroy,
  viewChild,
  Input
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonIconComponent } from '../iconButton/iconButton.component';

import { BrnDialogModule } from '@spartan-ng/brain/dialog';
import { HlmDialogModule } from '@spartan-ng/helm/dialog';

import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

import { HlmSwitchComponent } from '@spartan-ng/helm/switch';
import { PetsService } from '../../services/pets.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-floating',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HlmSwitchComponent,
    ButtonIconComponent,
    BrnDialogModule,
    HlmDialogModule,
    HlmInputDirective,
    HlmLabelDirective,
    HlmButtonDirective
  ],
  templateUrl: './floating.component.html',
  styleUrl: './floating.component.scss'
})
export class FloatingComponent implements AfterViewInit, OnDestroy {

  private mapDialog!: L.Map;
  private isMapInitialized = false;
  private mapObserver!: MutationObserver;
  private dialogVisible = false;
  private openCount = 0;


  private currentMarker: L.Marker | null = null;

  usuarioAutenticado = false;
  mensagemErro = '';
  apelido = '';
  descricao = '';
  localizacaoTexto = '';
  localizacaoCoords = { lat: 0, lon: 0 };
  coleira = false;
  status = 'Encontrado';
  imagem?: File;
  isMissing = false;

  constructor(
    private petsService: PetsService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngAfterViewInit() {
    this.setupMapObserver();
  }

  private setupMapObserver() {
    this.mapObserver = new MutationObserver(() => {
      const dialogEl = document.getElementById('map-dialog');
      const currentlyVisible = dialogEl && dialogEl.offsetParent !== null;

      if (currentlyVisible && !this.dialogVisible) {
        this.dialogVisible = true;
        this.openCount++;

        if (!this.isMapInitialized || this.openCount > 1) {
          if (this.isMapInitialized) {
            this.mapDialog.remove();
            this.isMapInitialized = false;
          }
          this.initMapDialog();
          this.locateUserOnMap();
          this.enableMapClick();
        } else {
          setTimeout(() => {
            this.mapDialog.invalidateSize();
          }, 200);
        }
      } else if (!currentlyVisible && this.dialogVisible) {
        this.dialogVisible = false;
      }
    });

    this.mapObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  handleDialogClick() {
    setTimeout(() => {
      this.onDialogOpened();
    }, 50);
  }

  private destroyed = false;

  async onDialogOpened() {
    const user = await this.authService.checkAuthWithoutRedirect();

    if (this.destroyed) return;

    console.log('Usuário autenticado:', user);

    if (!user) {
      this.usuarioAutenticado = false;
      this.mensagemErro = 'Você precisa estar logado para registrar um pet.';
      return;
    }

    this.usuarioAutenticado = true;

    if (this.isMapInitialized && this.mapDialog) {
      setTimeout(() => {
        if (!this.destroyed) {
          this.mapDialog.invalidateSize();
        }
      }, 300);
    }
  }

  initMapDialog() {
    if (this.isMapInitialized) return;

    this.mapDialog = L.map('map-dialog', {
      center: [-22.9068, -43.1729], // Centro padrão (Rio de Janeiro)
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.mapDialog);

    this.isMapInitialized = true;
  }

  private async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.display_name) {
        return data.display_name;
      }

      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Erro no reverse geocoding:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  }

  async locateUserOnMap() {
    if (!this.mapDialog) return;

    this.mapDialog.locate({ setView: true, maxZoom: 16 });

    this.mapDialog.once('locationfound', async (e: L.LocationEvent) => {
      if (this.currentMarker) {
        this.mapDialog.removeLayer(this.currentMarker);
        this.currentMarker = null;
      }

      this.currentMarker = L.marker(e.latlng).addTo(this.mapDialog).openPopup();

      this.localizacaoTexto = await this.reverseGeocode(e.latlng.lat, e.latlng.lng);
      this.localizacaoCoords.lat = e.latlng.lat;
      this.localizacaoCoords.lon = e.latlng.lng;
    });

    this.mapDialog.on('locationerror', () => {
      alert('Não foi possível obter sua localização.');
    });
  }

  enableMapClick() {
    if (!this.mapDialog) return;

    this.mapDialog.off('click');

    this.mapDialog.on('click', async (e: L.LeafletMouseEvent) => {
      if (this.currentMarker) {
        this.mapDialog.removeLayer(this.currentMarker);
      }

      this.currentMarker = L.marker(e.latlng).addTo(this.mapDialog);

      this.localizacaoTexto = await this.reverseGeocode(e.latlng.lat, e.latlng.lng);
      this.localizacaoCoords.lat = e.latlng.lat;
      this.localizacaoCoords.lon = e.latlng.lng;
    });
  }

  async searchLocation(query: string) {
    if (!query || !this.mapDialog) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.length === 0) {
        alert('Local não encontrado!');
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      this.mapDialog.setView([lat, lon], 16);

      if (this.currentMarker) {
        this.mapDialog.removeLayer(this.currentMarker);
      }

      this.currentMarker = L.marker([lat, lon]).addTo(this.mapDialog).bindPopup(query).openPopup();

      this.localizacaoTexto = data[0].display_name || query;
      this.localizacaoCoords.lat = lat;
      this.localizacaoCoords.lon = lon;
    } catch (error) {
      console.error('Erro ao buscar localização:', error);
      alert('Erro ao buscar localização.');
    }
  }

  @Input() recenterFn!: () => void;

  recenter() {
    if (this.recenterFn) {
      this.recenterFn();
    }
  }

  onToggleColeira(value: boolean) {
    this.coleira = value;
  }

  onToggleIsMissing(value: boolean) {
    this.isMissing = value;
  }

  onFileSelected(event: any) {
    this.imagem = event.target.files[0];
  }

  async onSubmitPet() {
    const user = await this.authService.validateAuth();

    if (!user) {
      alert('Você precisa estar logado para registrar um pet.');
      return;
    }

    if (!this.apelido || !this.descricao || !this.localizacaoTexto || !this.imagem) {
      alert('Preencha todos os campos e selecione uma imagem.');
      return;
    }

    this.petsService.registerPet({
      apelido: this.apelido,
      descricao: this.descricao,
      localizacao: this.localizacaoTexto,
      coleira: this.coleira,
      status: this.status,
      imagem: this.imagem,
      isMissing: this.isMissing,
      missingSince: this.isMissing ? new Date().toISOString() : null
    }).subscribe({
      next: () => this.toastService.show(
          'Você registrou um pet! 🐶'
        ),
      error: (err) => {
        this.toastService.show(
          'Erro ao registrar um pet',
          'Erro ao registrar um pet. Tente novamente.'
        );
        alert('Erro ao registrar o pet.');
      }
    });
  }

  ngOnDestroy() {
    if (this.mapObserver) {
      this.mapObserver.disconnect();
    }
    if (this.mapDialog) {
      this.mapDialog.remove();
    }

    this.destroyed = true;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}