import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { lucideMenu, lucideMap, lucidePawPrint, lucideBell, lucideCircleUserRound, lucideSettings, lucidePiggyBank, lucideMail } from '@ng-icons/lucide';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mobile-footer',
  imports: [
    HlmButtonDirective, 
    CommonModule, 
    HlmIconDirective,
    NgIcon
  ],
  providers: [provideIcons({ lucideMenu, lucideMap, lucidePawPrint, lucideBell, lucideCircleUserRound, lucideSettings, lucidePiggyBank, lucideMail })],
  templateUrl: './mobile-footer.component.html',
  styleUrls: ['./mobile-footer.component.scss']
})
export class MobileFooterComponent {
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

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
