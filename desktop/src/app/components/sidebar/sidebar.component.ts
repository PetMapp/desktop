import { Component } from '@angular/core';
import { ButtonIconComponent } from '../iconButton/iconButton.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BrnSheetContentDirective, BrnSheetTriggerDirective } from '@spartan-ng/brain/sheet';
import {
  HlmSheetComponent,
  HlmSheetContentComponent,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetTitleDirective,
} from '@spartan-ng/ui-sheet-helm';

import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideMap, lucidePawPrint, lucideBell, lucideCircleUserRound, lucideSettings, lucidePiggyBank, lucideSquareArrowUp } from '@ng-icons/lucide';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    NgIcon,
    HlmButtonDirective,
    HlmIconDirective,
    BrnSheetTriggerDirective,
    BrnSheetContentDirective,
    ButtonIconComponent,
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetDescriptionDirective,
    HlmSheetFooterComponent,
    HlmSheetHeaderComponent,
    HlmSheetTitleDirective,
  ],
  providers: [provideIcons({ lucideMenu, lucideMap, lucidePawPrint, lucideBell, lucideCircleUserRound, lucideSettings, lucidePiggyBank, lucideSquareArrowUp })],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(public router: Router) {}

  isActive(url: string): boolean {
    return this.router.url === url;
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }
}
