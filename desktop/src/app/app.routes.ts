import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MapComponent } from './map/map.component';
import { PetsComponent } from './pets/pets.component';
import { NotificationComponent } from './notification/notification.component';
import { ConfigComponent } from './config/config.component';
import { AppearenceComponent } from './config/appearence/appearence.component';

// Exportando a constante routes
export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'map', component: MapComponent },
  { path: 'pets', component: PetsComponent },
  { path: 'notifications', component: NotificationComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'config/appearence', component: AppearenceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
