import { Component, Input, forwardRef } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronRight,
  lucideMenu,
  lucideCircleUserRound,
  lucideHouse,
  lucideDog,
  lucideSearch,
  lucideLocateFixed,
  lucideCamera,
  lucideBell,
  lucidePawPrint,
  lucideMap,
  lucideArrowLeft,
  lucideMail,
} from '@ng-icons/lucide';
import { BrnDialogTriggerDirective } from '@spartan-ng/brain/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'spartan-button-icon',
  standalone: true,
  hostDirectives: [
    {
      directive: BrnDialogTriggerDirective,
      inputs: [],
      outputs: [],
    },
  ],
  imports: [CommonModule, HlmButtonDirective, HlmSpinnerComponent, HlmIconDirective, NgIcon],
  providers: [
    provideIcons({
      lucideChevronRight,
      lucideMenu,
      lucideCircleUserRound,
      lucideHouse,
      lucideDog,
      lucideSearch,
      lucideLocateFixed,
      lucideCamera,
      lucideBell,
      lucidePawPrint,
      lucideMap,
      lucideArrowLeft,
      lucideMail
    }),
  ],
  template: `
    <button
      hlmBtn
      [size]="buttonSize"
      [variant]="buttonVariant"
      [class]="customClass"
    >
      <ng-icon
        hlm
        [size]="iconSize"
        [name]="iconName"
        [style.stroke]="isActive ? '#159A9C' : 'currentColor'"
      ></ng-icon>
    </button>
  `,
})
export class ButtonIconComponent {
  @Input() iconName: string = 'lucideChevronRight';
  @Input() isActive = false;
  @Input() variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null = 'secondary';
  @Input() size: 'default' | 'sm' | 'lg' | 'icon' | null = 'sm';
  @Input() iconSize: 'sm' | 'md' | 'lg' | string = 'sm';
  @Input() customClass = '';

  get buttonSize(): 'default' | 'sm' | 'lg' | 'icon' {
    return this.size ?? 'sm';
  }

  get buttonVariant(): 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' {
    return this.variant ?? 'secondary';
  }
}
