import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from "../environments/environment";


const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', data: { loading: true, preload: true, breadcrumb: 'Inicio', tile: 'Inicio' },
      children: [
        { path: '',
          loadChildren: './inicio/inicio.module#InicioModule' // prod
        },
        { path: 'crear-prestacion',
          loadChildren: './recurso/recurso.module#RecursoModule', // prod
          data: { loading: true, preload: true, breadcrumb: 'Crear prestación', title: 'Crear prestación' } },
        { path: 'reporte',
          loadChildren: './reporte/reporte.module#ReporteModule', // prod
          data: { loading: true, preload: true, breadcrumb: 'Reportes', title: 'Reportes' } },
        { path: 'vista',
          loadChildren: './vista/vista.module#VistaModule', // prod
          data: { loading: true, preload: true, breadcrumb: 'Visualizar prestación', title: 'Visualizar prestación' } }
      ]
  },{ path: '**', redirectTo: 'inicio', pathMatch: 'full' },
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes)],
    exports: [RouterModule],
   // providers: [CustomPreloadingStrategy]
})
export class AppRoutingModule { }
