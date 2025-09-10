import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

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
  imports: [
    FormsModule,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmInputDirective,
    HlmLabelDirective,
    HlmButtonDirective,
    GoogleIconComponent,
    MapetsIconComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/map']);
    } catch (error) {
      this.toastService.show(
        'Erro no login',
        'Usuário ou senha inválidos.'
      );
    }
  }
}
