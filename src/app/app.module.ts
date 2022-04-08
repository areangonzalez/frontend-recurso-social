import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModule, NgbDatepickerI18n, NgbDateStruct, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from "ng2-charts";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PixelSpinnerModule } from "angular-epic-spinners";

/* Routing */
import { AppRoutingModule } from './app-routing.module';

// fake backend provider
//import { fakeBackendProvider } from "./shared/helpers/fake-backend";

/* Modulos */
import { CoreModule } from "./core/core.module";
import {
  AppLayoutComponent,
  AdminLayoutComponent,
  MensajesComponent,
  BreadcrumbComponent, BreadcrumbsService,
  CustomDatepickerI18n,
  LoaderComponent,
  SharedModule
} from "./shared";

import { AppComponent } from './app.component';
import { HttpClient } from 'selenium-webdriver/http';
import { ErrorInterceptor } from './shared/helpers/error.interceptor';
import { JwtInterceptor } from './shared/helpers/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    AdminLayoutComponent,
    MensajesComponent,
    BreadcrumbComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    NgbTooltipModule.forRoot(),
    PixelSpinnerModule,
    HttpClientModule,
    ChartsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    Title,
    BreadcrumbsService,

    // facke-backend providers
    //fakeBackendProvider

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
