import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HlmCardContentDirective, HlmCardDescriptionDirective, HlmCardDirective, HlmCardFooterDirective, HlmCardHeaderDirective, HlmCardTitleDirective, HlmInputDirective, HlmLabelDirective, HlmButtonDirective, GoogleIconComponent, MapetsIconComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async register() {
    if (this.password !== this.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      await this.authService.register(
        this.email,
        this.password,
        this.name,
        'https://i.pravatar.cc/150?u=' + this.email // foto de perfil genérica
      );
      alert('Conta criada com sucesso!');
      this.router.navigate(['/']); // ou para a tela desejada
    } catch (error: any) {
      alert('Erro ao registrar: ' + (error.message || error));
      console.error(error);
    }
  }
}
