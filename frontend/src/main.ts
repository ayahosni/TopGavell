import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent, AppProviders } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes'; 

bootstrapApplication(AppComponent, {
  providers: [
    ...AppProviders,
    importProvidersFrom(RouterModule.forRoot(routes)), 
  ]
}).catch((err) => console.error(err));
