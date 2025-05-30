import { Component } from '@angular/core';

import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';

import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { GoogleIconComponent } from '../../components/google-icon/google-icon.component';
import { MapetsIconComponent } from '../../components/mapets-icon/mapets-icon.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HlmCardContentDirective, HlmCardDescriptionDirective, HlmCardDirective, HlmCardFooterDirective, HlmCardHeaderDirective, HlmCardTitleDirective, HlmInputDirective, HlmLabelDirective, HlmButtonDirective, GoogleIconComponent, MapetsIconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private router: Router) {}

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
