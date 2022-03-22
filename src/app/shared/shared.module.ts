import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from "@angular/router";

import { HeaderComponent, FooterComponent } from "./layout";
import { FormPersonaComponent, BuscarPersonaComponent } from "./formulario/persona";
import { FormLugarComponent } from "./formulario/lugar";
import { FormContactoComponent, FormRedSocialComponent } from "./formulario/contacto";
import { PrestacionGeneralComponent, ModuloAlimentarComponent, FormRecursoComponent } from "./formulario/recurso";
import { FormGrupoFamiliarComponent } from "./formulario/grupo-familiar";
import { ListaPersonaComponent, ListaRedSocialComponent, ListaGrupoFamiliarComponent, ListaCuotaComponent } from './lista';
import { VistaHeaderComponent, VistaBodyPrestacionGeneralComponent, VistaInfoPersonaComponent, VistaInfoRecursoComponent, VistaInfoPrestacionesComponent } from "./vista";
import {
  ModalFormPersonaComponent, ModalFormPersonaContent,
  ModalInfoPersonaPrestacionComponent, ModalInfoPersonaPrestacionContent,
  ModalAcreditarComponent, ModalAcreditarContent, ModalConfirmarCanceladoAcreditarContent,
  ModalBajaComponent, ModalConfirmacionContent, ModalBajaContent, ModalConfirmarCanceladoBajaContent,
  ModalInfoBeneficiarioComponent, ModalInfoBeneficiarioContent,
  ModalRedSocialComponent, ModalRedSocialContent,
  ModalBorrarRedSocialComponent, ModalBorrarRedSocialContent,
  ModalConfirmacionDescargaComponent, ModalConfirmacionDescargaContent,
  ModalGrupoFamiliarComponent, ModalGrupoFamiliarContent,
  ModalBorrarMiembroGrupoFamiliarComponent, ModalBorrarMiembroGrupoFamiliarContent,
  BorrarCuotaContent, BorrarCuotaComponent,
  ModalAltaBajaAlumnoContent, ModalAltaBajaAlumnoComponent
} from "./modal";
import { ProgramaComponent } from "./programa";




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
      HeaderComponent, FooterComponent,
      BuscarPersonaComponent,
      FormLugarComponent,
      FormContactoComponent, FormRedSocialComponent,
      FormPersonaComponent,
      PrestacionGeneralComponent, ModuloAlimentarComponent, FormRecursoComponent,
      ListaPersonaComponent, ListaRedSocialComponent, ListaGrupoFamiliarComponent, ListaCuotaComponent,
      VistaHeaderComponent, VistaBodyPrestacionGeneralComponent, VistaInfoPersonaComponent, VistaInfoRecursoComponent, VistaInfoPrestacionesComponent,
      ModalFormPersonaComponent, ModalFormPersonaContent,
      ModalInfoPersonaPrestacionComponent, ModalInfoPersonaPrestacionContent,
      ModalAcreditarComponent, ModalAcreditarContent, ModalConfirmarCanceladoAcreditarContent,
      ModalBajaComponent, ModalConfirmacionContent, ModalBajaContent, ModalConfirmarCanceladoBajaContent,
      ModalInfoBeneficiarioComponent, ModalInfoBeneficiarioContent,
      ModalRedSocialComponent, ModalRedSocialContent,
      ModalBorrarRedSocialComponent, ModalBorrarRedSocialContent,
      ModalConfirmacionDescargaComponent, ModalConfirmacionDescargaContent,
      ProgramaComponent,
      FormGrupoFamiliarComponent,
      ModalGrupoFamiliarComponent, ModalGrupoFamiliarContent,
      ModalBorrarMiembroGrupoFamiliarComponent, ModalBorrarMiembroGrupoFamiliarContent,
      BorrarCuotaContent, BorrarCuotaComponent,
      ModalAltaBajaAlumnoContent, ModalAltaBajaAlumnoComponent
    ],
    exports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        HeaderComponent,
        BuscarPersonaComponent,
        FormLugarComponent,
        FormContactoComponent, FormRedSocialComponent,
        FormPersonaComponent,
        PrestacionGeneralComponent, ModuloAlimentarComponent, FormRecursoComponent,
        ListaPersonaComponent, ListaRedSocialComponent, ListaGrupoFamiliarComponent, ListaCuotaComponent,
        VistaHeaderComponent, VistaBodyPrestacionGeneralComponent, VistaInfoPersonaComponent, VistaInfoRecursoComponent, VistaInfoPrestacionesComponent,
        ModalFormPersonaComponent, ModalFormPersonaContent,
        ModalInfoPersonaPrestacionComponent, ModalInfoPersonaPrestacionContent,
        ModalAcreditarComponent, ModalAcreditarContent, ModalConfirmarCanceladoAcreditarContent,
        ModalBajaComponent, ModalConfirmacionContent, ModalBajaContent, ModalConfirmarCanceladoBajaContent,
        ModalInfoBeneficiarioComponent, ModalInfoBeneficiarioContent,
        ModalRedSocialComponent, ModalRedSocialContent,
        ModalBorrarRedSocialComponent, ModalBorrarRedSocialContent,
        ModalConfirmacionDescargaComponent, ModalConfirmacionDescargaContent,
        ProgramaComponent,
        FormGrupoFamiliarComponent,
        ModalGrupoFamiliarComponent, ModalGrupoFamiliarContent,
        ModalBorrarMiembroGrupoFamiliarComponent, ModalBorrarMiembroGrupoFamiliarContent,
        BorrarCuotaContent, BorrarCuotaComponent,
        ModalAltaBajaAlumnoContent, ModalAltaBajaAlumnoComponent
    ],
    entryComponents: [
      ModalFormPersonaComponent, ModalFormPersonaContent,
      ModalInfoPersonaPrestacionComponent, ModalInfoPersonaPrestacionContent,
      ModalAcreditarComponent, ModalAcreditarContent, ModalConfirmarCanceladoAcreditarContent,
      ModalBajaComponent, ModalConfirmacionContent, ModalBajaContent, ModalConfirmarCanceladoBajaContent,
      ModalInfoBeneficiarioComponent, ModalInfoBeneficiarioContent,
      ModalRedSocialComponent, ModalRedSocialContent,
      ModalBorrarRedSocialComponent, ModalBorrarRedSocialContent,
      ModalConfirmacionDescargaComponent, ModalConfirmacionDescargaContent,
      ModalGrupoFamiliarComponent, ModalGrupoFamiliarContent,
      ModalBorrarMiembroGrupoFamiliarComponent, ModalBorrarMiembroGrupoFamiliarContent,
      BorrarCuotaContent, BorrarCuotaComponent
    ]
})
export class SharedModule { }
