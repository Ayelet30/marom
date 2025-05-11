
// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { provideClientHydration } from '@angular/platform-browser';
// import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
// import { provideFirestore, getFirestore } from '@angular/fire/firestore';
// import { importProvidersFrom } from '@angular/core';
// import { provideAuth, getAuth } from '@angular/fire/auth';
// import { environment } from './environments/environment';
// import { provideRouter } from '@angular/router';
// import { routes } from './app/app.routes';

// bootstrapApplication(AppComponent, {
//   providers: [
//       provideFirebaseApp(() => initializeApp(environment.firebase)),
//       provideFirestore(() => getFirestore()),
//       provideAuth(() => getAuth()),
//     provideRouter(routes),
//     provideClientHydration()
//   ]
// }).catch(err => console.error(err));


import { bootstrapApplication } from '@angular/platform-browser';
import { provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [provideClientHydration(), ...appConfig.providers]
}).catch(err => console.error(err));



