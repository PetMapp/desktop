import { Component, Output, EventEmitter } from '@angular/core';
import { ButtonIconComponent } from '../iconButton/iconButton.component';

@Component({
  selector: 'app-floating',
  imports: [ButtonIconComponent],
  templateUrl: './floating.component.html',
  styleUrl: './floating.component.scss'
})
export class FloatingComponent {
  @Output() locateUser = new EventEmitter<void>();

  onLocateUser() {
    this.locateUser.emit();
  }
}
