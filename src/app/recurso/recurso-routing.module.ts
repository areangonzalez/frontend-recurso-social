import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecursoComponent } from './recurso.component';
import { ProgramaService, TipoRecursoService } from "../core/services";

const routes: Routes = [
    {
      path: '', component: RecursoComponent,
      data: { loading: true, preload: true, breadcrumb: 'Crear', title: 'Crear prestación' },
      resolve: {
        programas: ProgramaService,
        tipoRecursos: TipoRecursoService
      }
    },
    {
      path: ':programaid', component: RecursoComponent,
      data: { loading: true, preload: true, breadcrumb: 'Crear', title: 'Crear prestación' },
      resolve: {
        programas: ProgramaService,
        tipoRecursos: TipoRecursoService
      }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ProgramaService, TipoRecursoService]
})
export class RecursoRoutingModule { }
