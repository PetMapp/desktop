import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { lucideMenu, lucideMap, lucidePawPrint, lucideBell, lucideCircleUserRound, lucideSettings, lucidePiggyBank } from '@ng-icons/lucide';

@Component({
  selector: 'app-mobile-footer',
  imports: [
    HlmButtonDirective, 
    CommonModule, 
    HlmIconDirective,
    NgIcon
  ],
  providers: [provideIcons({ lucideMenu, lucideMap, lucidePawPrint, lucideBell, lucideCircleUserRound, lucideSettings, lucidePiggyBank })],
  templateUrl: './mobile-footer.component.html',
  styleUrls: ['./mobile-footer.component.scss']
})
export class MobileFooterComponent {
  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
