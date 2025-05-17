// button.component.ts
import { Component, Input } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'spartan-button',
  standalone: true,
  imports: [HlmButtonDirective],
  template: `
    <button hlmBtn variant="secondary">
      {{ text }}<ng-content *ngIf="!text"></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() text?: string;
}
