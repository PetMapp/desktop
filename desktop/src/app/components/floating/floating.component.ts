import { Component, Output, EventEmitter } from '@angular/core';
import { ButtonIconComponent } from '../iconButton/iconButton.component';

import { BrnDialogModule } from '@spartan-ng/brain/dialog';
import { HlmDialogModule } from '@spartan-ng/helm/dialog';

@Component({
  selector: 'app-floating',
  standalone: true,
  imports: [
    ButtonIconComponent,
    BrnDialogModule,
    HlmDialogModule,
  ],
  templateUrl: './floating.component.html',
  styleUrl: './floating.component.scss'
})
export class FloatingComponent {
  @Output() locateUser = new EventEmitter<void>();

  onLocateUser() {
    this.locateUser.emit();
  }
}