import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonIconComponent } from '../iconButton/iconButton.component';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { ButtonComponent } from '../button/button.component';
import { MobileFooterComponent } from '../mobile-footer/mobile-footer.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonIconComponent, ButtonComponent, MobileFooterComponent, HlmInputDirective, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  searchQuery = '';

  @Output() search = new EventEmitter<string>();

  onSearch() {
    this.search.emit(this.searchQuery);
  }
}
