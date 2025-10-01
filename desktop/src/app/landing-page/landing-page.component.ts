import { Component } from '@angular/core';
import { MapetsIconComponent } from '../components/mapets-icon/mapets-icon.component';
import { MapViewComponent } from '../components/map-view/map-view.component';
import { Router } from '@angular/router';
import { Redirection } from '../utils/redirection';
import { viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

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

import { IconComponent } from '../components/icon-component/icon-component.component';
import { Icon } from 'leaflet';

@Component({
  selector: 'app-landing-page',
  imports: [
    MapetsIconComponent,
    MapViewComponent,
    BrnSheetComponent,
    BrnSheetTriggerDirective,
    BrnSheetContentDirective,
    HlmSheetComponent,
    HlmSheetHeaderComponent,
    HlmSheetTitleDirective,
    HlmSheetDescriptionDirective,
    HlmSheetContentComponent,
    HlmSheetFooterComponent,
    IconComponent,
    CommonModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  private redirection: Redirection;
  public readonly viewchildSheetRef = viewChild(HlmSheetComponent);
  public isSheetOpen = false;

  constructor(private router: Router) {
    this.redirection = new Redirection(this.router);
  }

  goToLogin(): void {
    this.redirection.goTo('/login');
  }

  goToRegister(): void {
    this.redirection.goTo('/register');
  }


  onSheetChange(open: Event) {
    this.isSheetOpen = !!open;
  }

  closeSheet() {
    this.viewchildSheetRef()?.close({});
    this.isSheetOpen = false;
  }

  openSheet() {
    this.isSheetOpen = true;
  }
}
