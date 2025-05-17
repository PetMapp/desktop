import { Component } from '@angular/core';
import { ButtonIconComponent } from '../iconButton/iconButton.component';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { ButtonComponent } from '../button/button.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonIconComponent, ButtonComponent, HlmInputDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
