import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

bootstrapApplication(AppComponent, {
  providers: [
    ...config.providers 
  ]
}).catch(err => console.error(err));

