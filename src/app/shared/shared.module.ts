import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from "@angular/router";

import { FormPersonaComponent, BuscarPersonaComponent } from "./formulario/persona";
import { FormLugarComponent } from "./formulario/lugar";
import { FormContactoComponent } from "./formulario/contacto";
import { FormRecursoComponent } from "./formulario/recurso";
import { ListaPersonaComponent } from './lista';
import { VistaInfoPersonaComponent } from "./vista";
import { ModalFormPersonaComponent, ModalFormPersonaContent } from "./modal";




@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        FormsModule, ReactiveFormsModule,
        HttpClientModule,
        RouterModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
      BuscarPersonaComponent,
      FormLugarComponent,
      FormContactoComponent,
      FormPersonaComponent,
      FormRecursoComponent,
      ListaPersonaComponent,
      VistaInfoPersonaComponent,
      ModalFormPersonaComponent, ModalFormPersonaContent
    ],
    exports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        BuscarPersonaComponent,
        FormLugarComponent,
        FormContactoComponent,
        FormPersonaComponent,
        FormRecursoComponent,
        ListaPersonaComponent,
        VistaInfoPersonaComponent,
        ModalFormPersonaComponent, ModalFormPersonaContent
    ],
    entryComponents: [ModalFormPersonaComponent, ModalFormPersonaContent]
})
export class SharedModule { }
