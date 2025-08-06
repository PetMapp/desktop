import { Component, EventEmitter, Output } from '@angular/core';
import { IconComponent } from '../icon-component/icon-component.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-display',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './message-display.component.html',
  styleUrl: './message-display.component.scss'
})
export class MessageDisplayComponent {
  @Output() backToList = new EventEmitter<void>();

  onBackClick() {
    this.backToList.emit();
  }
}
