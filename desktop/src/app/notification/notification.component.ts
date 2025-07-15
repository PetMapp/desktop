import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MapViewComponent } from '../components/map-view/map-view.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../services/notification-service';
import NotificationListDTO_Res from '../interfaces/DTOs/res/NotificationListDTO_Res';
import { HeaderComponent } from '../components/header/header.component';
import { MobileFooterComponent } from '../components/mobile-footer/mobile-footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MobileFooterComponent, MapViewComponent],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements AfterViewInit, OnInit {

  notifications: NotificationListDTO_Res[] = [];
  loading = false;

  @ViewChild(MapViewComponent) mapView!: MapViewComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  async ngOnInit() {
    await this.loadNotifications();
  }

  async loadNotifications() {
    this.loading = true;
    const data = await this.notificationService.listNotifications();
    this.notifications = data || [];
    this.loading = false;
  }

  async onViewMore(notification: NotificationListDTO_Res) {
    const marked = await this.notificationService.markAsRead(notification.id);
    if (marked) {
      notification.read = true;
    }

    this.router.navigate(['/map'], {
      state: {
        petId: notification.relatedPetId,
        commentId: notification.relatedCommentId ?? null,
        openSheet: true
      }
    });
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      const searchQuery = params['search'];
      if (searchQuery) {
        this.searchLocation(searchQuery);
      }
    });
  }

  searchLocation(query: string) {
    this.mapView?.searchLocation(query);
  }

  recenterMap() {
    this.mapView?.locateUser();
  }

  public getTimeSinceCreation(dateString: string): string {
    const createdAt = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `há ${days} dia${days > 1 ? 's' : ''}`;
    if (hours > 0) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return `agora mesmo`;
  }
}
