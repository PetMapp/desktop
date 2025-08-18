import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

import {
  HlmTabsComponent,
  HlmTabsListComponent,
  HlmTabsTriggerDirective,
  HlmTabsContentDirective
} from '@spartan-ng/helm/tabs';

@Component({
  selector: 'app-request-component',
  imports: [
    CommonModule,
    HlmButtonDirective,
    HlmTabsComponent,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    HlmTabsContentDirective
  ],
  templateUrl: './request-component.component.html',
  styleUrl: './request-component.component.scss'
})
export class RequestComponentComponent {

}
