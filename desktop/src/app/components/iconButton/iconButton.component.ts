import { Component, Input } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';

// ícones do Lucide
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideMenu } from '@ng-icons/lucide';

// componente que realmente renderiza o <ng-icon>
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'spartan-button-icon',
  standalone: true,
  imports: [
    HlmButtonDirective,
    HlmSpinnerComponent,
    HlmIconDirective,
    NgIcon,                 
  ],
  providers: [
    provideIcons({ lucideChevronRight, lucideMenu }), // Você pode adicionar mais ícones aqui depois
  ],
  template: `
    <button hlmBtn size="icon" variant='secondary'>
      <ng-icon hlm size="sm" [name]="iconName" size='sm'></ng-icon>
    </button>
  `,
})
export class ButtonIconComponent {
  @Input() iconName: string = 'lucideChevronRight';
}
