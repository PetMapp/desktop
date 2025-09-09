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

import { Router } from '@angular/router';

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
  isRequestsPage = false;

  loading = true;

  constructor(
    private requestService: RequestService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isRequestsPage = this.router.url === '/requests';
    
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

  acceptRequest(requestId: string, ctx: any) {
    this.requestService.updateRequestStatus(requestId, 'accepted').subscribe(updatedRequest => {
      this.requestsForMyPets = this.requestsForMyPets.map(req =>
        req.id === updatedRequest.id ? updatedRequest : req
      );
      ctx.close();
    });
  }

  rejectRequest(requestId: string, ctx: any) {
    this.requestService.updateRequestStatus(requestId, 'rejected').subscribe(updatedRequest => {
      this.requestsForMyPets = this.requestsForMyPets.map(req =>
        req.id === updatedRequest.id ? updatedRequest : req
      );
      ctx.close();
    });
  }

  goToRequests() {
    this.router.navigate(['/requests']);
  }
}
