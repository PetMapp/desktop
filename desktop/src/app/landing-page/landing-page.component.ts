import { Component } from '@angular/core';
import { MapetsIconComponent } from '../components/mapets-icon/mapets-icon.component';
import { MapViewComponent } from '../components/map-view/map-view.component';
import { Router } from '@angular/router';
import { Redirection } from '../utils/redirection';

@Component({
  selector: 'app-landing-page',
  imports: [MapetsIconComponent, MapViewComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  private redirection: Redirection;
  constructor(private router: Router) {
    this.redirection = new Redirection(this.router);
  }

  goToLogin(): void {
    this.redirection.goTo('/login');
  }

  goToRegister(): void {
    this.redirection.goTo('/register');
  }
}
