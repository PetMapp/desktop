import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { PetsService } from '../../services/pets.service';
import { user, User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { MobileFooterComponent } from '../mobile-footer/mobile-footer.component';
import { ButtonIconComponent } from '../iconButton/iconButton.component';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { ButtonComponent } from '../button/button.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { BrnDialogComponent, BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/brain/dialog';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/helm/dialog';

import { UserMenuComponent } from '../user-menu/user-menu.component';

import { IconComponent } from '../icon-component/icon-component.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

import { MapetsIconComponent } from '../mapets-icon/mapets-icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    MapetsIconComponent,
    SidebarComponent,
    UserMenuComponent,
    NotificationsComponent,
    IconComponent,
    BrnMenuTriggerDirective,
    ButtonIconComponent,
    ButtonComponent,
    MobileFooterComponent,
    HlmInputDirective,
    CommonModule,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchQuery = '';
  userLogged: User | null = null;
  nearbyPets: any[] = [];
  private userSub!: Subscription;
  @ViewChild(BrnDialogComponent) dialogRef!: BrnDialogComponent;
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  @Output() search = new EventEmitter<string>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private petService: PetsService
  ) { }

  ngOnInit() {
    this.userSub = this.authService.getUserLogged().subscribe(user => {
      this.userLogged = user;
    });

    this.loadNearbyPets();
  }

  closeDialog() {
    this.dialogRef?.close({});
  }

  loadNearbyPets() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        this.petService.listPetsNearby(latitude, longitude).subscribe({
          next: (response) => {
            this.nearbyPets = response.data;
          },
          error: (error) => {
            console.error('Error loading nearby pets:', error);
          }
        });
      },
      (geoError) => {
        console.warn('Geolocation error:', geoError);
      }
    );
  }

  openPet(petId: string) {
    window.dispatchEvent(new CustomEvent('openPetSheet', {
      detail: {
        petId: petId,
        commentId: null
      }
    }));
  }

  scrollLeft() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -100, behavior: 'smooth' });
    }
  }

  scrollRight() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 100, behavior: 'smooth' });
    }
  }

  onSearch() {
    const query = this.searchQuery.trim();

    if (!query) return;

    if (this.router.url.startsWith('/map')) {
      this.search.emit(query);
    } else {
      this.router.navigate(['/map'], { queryParams: { search: query } });
    }
  }

  async logout() {
    await this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
