import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
  HlmMenuSeparatorComponent,
} from '@spartan-ng/ui-menu-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

import { NotificationsComponent } from '../notifications/notifications.component';
import { ButtonIconComponent } from '../iconButton/iconButton.component';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    HlmButtonDirective,
    CommonModule,
    NotificationsComponent,
    BrnMenuTriggerDirective,
    HlmMenuComponent,
    HlmMenuGroupComponent,
    HlmMenuItemDirective,
    HlmMenuSeparatorComponent,
    ButtonIconComponent
  ],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
  @Input() userLogged!: User | null;

  constructor(private router: Router) { }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToMessages() {
    this.router.navigate(['/messages']);
  }


  async logout() {
    localStorage.clear();
    await this.router.navigate(['/login']);
  }
}
