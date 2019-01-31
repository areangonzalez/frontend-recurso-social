import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';

import {
  TitleService,
  ApiService,
  PersonaService
} from './services';

import { UtilService } from "./utils";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    TitleService,
    UtilService,
    ApiService,
    PersonaService
    /* ArticlesService,
    AuthGuard,
    CommentsService,
    JwtService,
    ProfilesService,
    TagsService,
    UserService */
  ],
  declarations: []
})
export class CoreModule { }
