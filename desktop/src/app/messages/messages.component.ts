import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { AlternativeHeaderComponent } from '../components/alternative-header/alternative-header.component';
import { IconComponent } from '../components/icon-component/icon-component.component';
import { MobileFooterComponent } from '../components/mobile-footer/mobile-footer.component';
import { MessageDisplayComponent } from '../components/message-display/message-display.component';

import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/brain/dialog';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/helm/dialog';

@Component({
  selector: 'app-messages',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HeaderComponent,
    AlternativeHeaderComponent,
    IconComponent,
    MobileFooterComponent,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    MessageDisplayComponent
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  showChatOnMobile = false

  toggleMobileView() {
    this.showChatOnMobile = !this.showChatOnMobile
  }
}
