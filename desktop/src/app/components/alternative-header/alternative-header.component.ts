import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonIconComponent } from '../iconButton/iconButton.component';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { IconComponent } from '../../components/icon-component/icon-component.component';

@Component({
  selector: 'app-alternative-header',
  standalone: true,
  imports: [
    ButtonIconComponent,
    HlmButtonDirective,
    IconComponent
  ],
  templateUrl: './alternative-header.component.html',
  styleUrl: './alternative-header.component.scss'
})
export class AlternativeHeaderComponent {
  @Input() pageName: string = '';

  @Input() returnUrl: string = '/';

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate([this.returnUrl]);
  }
}
