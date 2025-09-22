import { Component } from '@angular/core';
import { MapetsIconComponent } from '../components/mapets-icon/mapets-icon.component';
import { MapViewComponent } from '../components/map-view/map-view.component';

@Component({
  selector: 'app-landing-page',
  imports: [MapetsIconComponent, MapViewComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
