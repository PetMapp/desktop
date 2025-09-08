import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmTabsComponent,
  HlmTabsListComponent,
  HlmTabsTriggerDirective,
  HlmTabsContentDirective
} from '@spartan-ng/helm/tabs';

import { RequestService, PetRequest } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';
import { translateStatus } from '../../utils/status-utils';
import { formatDateBR } from '../../utils/date';
import { IconComponent } from '../icon-component/icon-component.component';
import { BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective } from '@spartan-ng/brain/alert-dialog';
import {
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogComponent,
  HlmAlertDialogContentComponent,
  HlmAlertDialogDescriptionDirective,
  HlmAlertDialogFooterComponent,
  HlmAlertDialogHeaderComponent,
  HlmAlertDialogOverlayDirective,
  HlmAlertDialogTitleDirective,
} from '@spartan-ng/helm/alert-dialog';

@Component({
  selector: 'app-request-component',
  standalone: true,
  imports: [
    CommonModule,
    HlmButtonDirective,
    HlmTabsComponent,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    HlmTabsContentDirective,
    IconComponent,
    BrnAlertDialogTriggerDirective,
    BrnAlertDialogContentDirective,
    HlmAlertDialogComponent,
    HlmAlertDialogContentComponent,
    HlmAlertDialogOverlayDirective,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogTitleDirective,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogActionButtonDirective,
    HlmAlertDialogCancelButtonDirective
  ],
  templateUrl: './request-component.component.html',
  styleUrl: './request-component.component.scss'
})
export class RequestComponentComponent implements OnInit {
  translateStatus = translateStatus;
  formatDateBR = formatDateBR;
  myRequests: PetRequest[] = [];
  requestsForMyPets: PetRequest[] = [];

  loading = true;

  constructor(
    private requestService: RequestService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.auth.getUserLogged().subscribe(user => {
      if (!user) return;

      this.requestService.getRequestsByUser(user.uid).subscribe(res => {
        this.myRequests = res.data ?? [];
        console.log('Minhas solicitações:', this.myRequests);
      });

      this.requestService.getRequestsForUserPet(user.uid).subscribe(res => {
        this.requestsForMyPets = res.data ?? [];
        this.loading = false;
      });
    });
  }
}
