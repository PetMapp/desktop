import { Component } from '@angular/core';
import { ButtonIconComponent } from '../iconButton/iconButton.component';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { ButtonComponent } from '../button/button.component';
import { MobileFooterComponent } from '../mobile-footer/mobile-footer.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonIconComponent, ButtonComponent, MobileFooterComponent, HlmInputDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
