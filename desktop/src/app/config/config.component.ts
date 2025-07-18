import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { MobileFooterComponent } from '../components/mobile-footer/mobile-footer.component';
import { HeaderComponent } from '../components/header/header.component';
import { IconComponent } from '../components/icon-component/icon-component.component';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-config',
  imports: [
    CommonModule,
    HeaderComponent,
    MobileFooterComponent,
    IconComponent,
    HlmButtonDirective
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  userLogged: User | null = null;
  private userSub!: Subscription;

  ngOnInit() {
    this.userSub = this.authService.getUserLogged().subscribe(user => {
      this.userLogged = user;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
  
  goToLogin() {
    this.router.navigate(['/login']);
  }

  async logout() {
    await this.authService.logout();
  }
}
