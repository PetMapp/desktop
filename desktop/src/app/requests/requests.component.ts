import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { MobileFooterComponent } from '../components/mobile-footer/mobile-footer.component';
import { HeaderComponent } from '../components/header/header.component';
import { RequestComponentComponent } from '../components/request-component/request-component.component';

@Component({
  selector: 'app-requests',
  imports: [
    CommonModule,
    HlmButtonDirective,
    MobileFooterComponent,
    HeaderComponent,
    RequestComponentComponent
  ],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss'
})
export class RequestsComponent {

}
