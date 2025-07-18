import { Component, Input } from '@angular/core';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronRight,
  lucideMenu,
  lucideCircleUserRound,
  lucideHouse,
  lucideDog,
  lucidePawPrint,
  lucideMapPin,
  lucideScrollText,
  lucideMap,
  lucideCheck,
  lucideX,
  lucideSettings,
  lucideHeart,
  lucideReply,
  lucidePencil,
  lucideEllipsis,
  lucideTrash,
  lucideShield,
  lucideLoaderCircle,
  lucidePaintBucket,
  lucidePalette,
  lucideLogOut,
  lucideArrowLeft,
} from '@ng-icons/lucide';

@Component({
  selector: 'spartan-icon',
  standalone: true,
  imports: [HlmIconDirective, NgIcon],
  providers: [
    provideIcons({
      lucideChevronRight,
      lucideMenu,
      lucideCircleUserRound,
      lucideHouse,
      lucideDog,
      lucidePawPrint,
      lucideMapPin,
      lucideScrollText,
      lucideMap,
      lucideCheck,
      lucideX,
      lucideSettings,
      lucideHeart,
      lucideReply,
      lucidePencil,
      lucideEllipsis,
      lucideTrash,
      lucideShield,
      lucideLoaderCircle,
      lucidePalette,
      lucideLogOut,
      lucideArrowLeft
    }),
  ],
  template: `
    <ng-icon
      hlm
      [name]="iconName"
      [size]="iconSize"
      class="stroke-black"
    ></ng-icon>
  `,
})
export class IconComponent {
  /** Nome do ícone */
  @Input() iconName: string = 'lucideChevronRight';

  /** Tamanho do ícone */
  @Input() iconSize: 'sm' | 'md' | 'lg' | string = 'md';
}
