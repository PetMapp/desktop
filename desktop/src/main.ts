import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// módulos auxiliares do Angular
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// se você usa roteamento:
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // onde você definiu suas rotas

// AngularFire (modular)
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    // -------------------------------------------------------
    // ESSENCIAL: registra os módulos core do Angular
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,  // se usar animações ou Material
      HttpClientModule,
    ),

    // -------------------------------------------------------
    // (Opcional) Se seu AppComponent usa <router-outlet>
    provideRouter(routes),

    // -------------------------------------------------------
    // Firebase
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
  ]
})
.catch(err => console.error(err));
