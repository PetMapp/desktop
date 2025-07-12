import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectorRef, ElementRef, HostListener, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { IconComponent } from '../icon-component/icon-component.component';
import { ButtonIconComponent } from '../iconButton/iconButton.component';
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
import { AuthService } from '../../services/auth.service';
import { PetLocationModel } from '../../models/pet-location-model';
import { PetdetailDTORes } from '../../interfaces/DTOs/petdetail-dto-res';
import { PetDetailUser } from '../../interfaces/DTOs/petuser-dto-res';

import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

import { CommentaryService } from '../../services/commentary.service';
import { CommentaryListDTO_Res } from '../../interfaces/DTOs/res/CommentaryListDTO_Res';
import { CreateCommentaryDTO_Req } from '../../interfaces/DTOs/res/CreateCommentaryDTO_Req';

import { FormsModule } from '@angular/forms';

import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';

import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuComponent,
} from '@spartan-ng/ui-menu-helm';

import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/brain/dialog';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/helm/dialog';

import { Router } from '@angular/router';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [
    ButtonIconComponent,
    FormsModule,
    CommonModule,
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
    IconComponent,
    HlmMenuComponent,
    HlmMenuGroupComponent,
    HlmMenuItemDirective,
    HlmMenuItemIconDirective,
    HlmMenuItemSubIndicatorComponent,
    HlmMenuLabelComponent,
    HlmMenuSeparatorComponent,
    HlmMenuShortcutComponent,
    HlmSubMenuComponent,
    BrnMenuTriggerDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective
  ],
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements AfterViewInit {
  @ViewChild('sheet', { static: true }) sheet!: BrnSheetComponent;
  @ViewChild('hiddenTrigger', { static: false }) hiddenTrigger!: ElementRef;

  public petDetail: PetDetailUser | null = null;
  public activePetId: string | null = null;
  public currentUserId: string | null = null;
  replyCounts: { [commentId: string]: number } = {};
  showReplies: { [commentId: string]: boolean } = {};
  replies: { [commentId: string]: CommentaryListDTO_Res[] } = {};
  public replyingToId: string | null = null;
  public replyingToRootId: string | null = null;
  public replyingToName: string | null = null;
  public isEditing: boolean = false;
  public editingCommentId: string | null = null;
  public commentToDelete: CommentaryListDTO_Res | null = null;
  expandedComments: Record<string, boolean> = {};
  expandedReplies: Record<string, boolean> = {};
  private map!: L.Map;
  public isMobile = false;
  private userLocationMarker?: L.Marker;

  constructor(
    private api: ApiServiceService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private commentaryService: CommentaryService,
    private router: Router
  ) { }

  public comments: CommentaryListDTO_Res[] = [];
  public newCommentText: string = '';

  async ngAfterViewInit() {
    this.auth.getUserLogged().subscribe(user => {
      this.currentUserId = user?.uid ?? null;
    });

    // 🔔 Escuta por eventos de notificação
    this.listenToNotificationSheetTrigger();

    setTimeout(async () => {
      this.initMap();
      await this.loadPetMarkers();
      this.setupLocationHandlers();
    }, 100);

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { petId?: string; commentId?: string };

    if (state?.petId) {
      await this.openPetSheet(state.petId, state.commentId);
    }
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

  private listenToNotificationSheetTrigger() {
    window.addEventListener('openPetSheet', async (event: any) => {
      const { petId, commentId } = event.detail;
      await this.openPetSheet(petId, commentId);
    });
  }

  private async openPetSheet(petId: string, commentId?: string) {
    await this.handleMarkerClick(petId);

    if (commentId) {
      setTimeout(() => this.scrollToComment(commentId), 600);
    }
  }

  public async submitComment() {
    const text = this.newCommentText.trim();
    const petId = this.activePetId;

    if (!text || !petId) return;

    if (this.isEditing && this.editingCommentId) {
      const success = await this.commentaryService.editComment({
        commentaryId: this.editingCommentId,
        newText: text,
      });

      if (success) {
        this.isEditing = false;
        this.editingCommentId = null;
        this.newCommentText = '';
        await this.loadComments(petId);
        this.cdr.detectChanges();
      }
      return;
    }

    const data: CreateCommentaryDTO_Req = {
      petId,
      text,
      parentId: this.replyingToId ?? null,
    };

    const result = await this.commentaryService.createComment(data);

    if (result.success) {
      this.newCommentText = '';
      const wasReply = !!this.replyingToId;

      if (wasReply && this.replyingToId) {
        try {
          const rootCommentId = this.replyingToRootId || await this.findRootCommentId(this.replyingToId);

          await this.refreshReplies(rootCommentId);

          this.cdr.markForCheck();
          this.cdr.detectChanges();
        } catch (err) {
          console.error('Erro ao carregar respostas:', err);
          await this.loadComments(petId);
        }
      } else {
        await this.loadComments(petId);
      }

      // Reset reply state
      this.replyingToId = null;
      this.replyingToName = null;
      this.replyingToRootId = null;
    } else {
      console.error('Erro ao enviar comentário:', result.error);
    }
  }

  public edit(comment: CommentaryListDTO_Res) {
    this.newCommentText = comment.text;
    this.editingCommentId = comment.id;
    this.isEditing = true;
    this.replyingToId = null;
    this.replyingToName = null;
  }

  public cancelEdit() {
    this.isEditing = false;
    this.editingCommentId = null;
    this.newCommentText = '';
  }

  private async findRootCommentId(commentId: string): Promise<string> {
    try {
      let currentId = commentId;
      let parentId: string | null = null;
      let safetyCounter = 10;

      do {
        const current = await this.commentaryService.getCommentById(currentId);

        if (!current) {
          console.warn('Comentário não encontrado:', currentId);
          break;
        }

        if (safetyCounter-- <= 0) {
          console.warn('Limite de segurança atingido em findRootCommentId');
          break;
        }

        parentId = current.parentId ?? null;

        if (parentId) {
          currentId = parentId;
        }
      } while (parentId);

      return currentId;
    } catch (err) {
      console.error('Erro dentro de findRootCommentId:', err);
      throw err;
    }
  }

  private scrollToComment(commentId: string) {
    const el = document.getElementById(`comment-${commentId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('bg-yellow-100');

      setTimeout(() => {
        el.classList.remove('bg-yellow-100');
      }, 2000);
    }
  }

  public async confirmDelete() {
    if (!this.commentToDelete) return;

    const success = await this.commentaryService.removeComment({
      commentaryId: this.commentToDelete.id,
    });

    if (!success || !this.activePetId) {
      console.error('Erro ao deletar comentário');
      return;
    }

    const parentId = this.commentToDelete.parentId;

    if (parentId) {
      // Encontre o comentário pai raiz
      const rootParentId = await this.findRootCommentId(parentId);
      await this.refreshReplies(rootParentId);
    } else {
      await this.loadComments(this.activePetId);
    }

    this.commentToDelete = null;
  }

  private async loadComments(petId: string) {
    try {
      const res = await this.commentaryService.listComments(petId);
      this.comments = res ?? [];

      this.replyCounts = {};

      for (const comment of this.comments) {
        const count = await this.commentaryService.countReplies(comment.id);

        if (count > 0) {
          this.replyCounts[comment.id] = count;
        }
      }
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  }

  public async toggleReplies(commentId: string) {
    this.showReplies[commentId] = !this.showReplies[commentId];

    // Se for para exibir e ainda não buscou, então busca
    if (this.showReplies[commentId] && !this.replies[commentId]) {
      const fetchedReplies = await this.commentaryService.getReplies(commentId);
      this.replies[commentId] = fetchedReplies ?? [];
      this.cdr.detectChanges();
    }
  }

  public async replyTo(comment: CommentaryListDTO_Res) {
    this.replyingToId = comment.id;
    this.replyingToName = comment.user?.displayName ?? 'Usuário';

    // Descobrir o comentário raiz dessa resposta
    this.replyingToRootId = await this.findRootCommentId(comment.id);

    this.isEditing = false;
    this.editingCommentId = null;

    setTimeout(() => {
      const textarea = document.querySelector('textarea[placeholder="Deixe seu comentário..."]') as HTMLTextAreaElement;
      if (textarea) textarea.focus();
    }, 100);
  }

  private async refreshReplies(commentId: string) {
    const fetchedReplies = await this.commentaryService.getReplies(commentId);
    this.replies[commentId] = [...(fetchedReplies ?? [])];
    this.replyCounts[commentId] = this.replies[commentId].length;

    if (this.replyCounts[commentId] === 0) {
      this.showReplies[commentId] = false;
    }

    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  public cancelReply() {
    this.replyingToId = null;
    this.replyingToName = null;
  }

  private async handleMarkerClick(petId: string | number) {
    try {
      this.activePetId = petId.toString();
      this.loadComments(petId.toString());

      console.log(this.activePetId, 'Pet ID ativo');

      const petDetail = await this.api.get<PetdetailDTORes>(
        `/pet/find/get/${petId}`,
        true
      );
      console.log('Pet detail:', petDetail);

      if (petDetail) {
        const usuario = await this.auth.getUserById(petDetail.userId);

        this.ngZone.run(() => {
          this.petDetail = {
            ...petDetail,
            user: usuario
          };

          this.cdr.detectChanges();

          setTimeout(() => this.sheet?.open(), 50);
          setTimeout(() => this.hiddenTrigger?.nativeElement?.click(), 100);
          setTimeout(() => this.sheet?.open(), 200);
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

  public locateUser() {
    if (!this.map) {
      console.warn('Mapa não inicializado');
      return;
    }

    this.setupLocationHandlers();
  }

  public getTimeSinceCreation(dateString: string): string {
    const createdAt = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `há ${days} dia${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `há ${hours} hora${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else {
      return `agora mesmo`;
    }
  }

  public async countReplies(commentId: string): Promise<number> {
    const count = await this.commentaryService.countReplies(commentId);
    return count;
  }
}