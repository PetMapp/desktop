import { Component, Input } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronRight,
  lucideMenu,
  lucideCircleUserRound,
  lucideHouse,
  lucideDog,
  lucideSearch,
  lucideLocate,
  lucideCamera,
  lucideLocateFixed,
  lucideBell
} from '@ng-icons/lucide';
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
    provideIcons({ lucideChevronRight, lucideMenu, lucideCircleUserRound, lucideHouse, lucideDog, lucideSearch, lucideLocateFixed, lucideCamera, lucideBell }),
  ],
  template: `
    <button
      hlmBtn
      [size]="buttonSize"
      [variant]="buttonVariant"
      [class.bg-gray-200]="isActive"
      [class]="customClass"
    >
      <ng-icon hlm [size]="iconSize" [name]="iconName"></ng-icon>
    </button>
  `,
})
export class ButtonIconComponent {
  /** Nome do ícone a ser exibido */
  @Input() iconName: string = 'lucideChevronRight';

  /** Botão ativo (para estilos customizados) */
  @Input() isActive = false;

  /** Variante do botão (padrão: secondary) */
  @Input() variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null = 'secondary';

  /** Tamanho do botão (padrão: sm) */
  @Input() size: 'default' | 'sm' | 'lg' | 'icon' | null = 'sm';

  /** Tamanho do ícone interno (padrão: sm) */
  @Input() iconSize: 'sm' | 'md' | 'lg' | string = 'sm';

  /** Classe extra para estilização (ex.: posicionamento) */
  @Input() customClass = '';

  get buttonSize(): 'default' | 'sm' | 'lg' | 'icon' {
    return this.size ?? 'sm';
  }

  get buttonVariant(): 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' {
    return this.variant ?? 'secondary';
  }
}
