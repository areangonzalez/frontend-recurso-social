import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BeneficiarioComponent } from './beneficiario.component';
import { FormularioComponent } from "./formulario";
import { ListaComponent } from './lista';

const routes: Routes = [
    {
        path: '',
        component: BeneficiarioComponent,
        children: [
          { path: '', redirectTo: 'lista', pathMatch: 'full' },
          { path: 'lista', component: ListaComponent, data: { breadcrumb: 'Lista' } },
          { path: 'crear', component: FormularioComponent, data: { breadcrumb: 'Crear' } },
          /* { path: 'editar/:id', component: AscensoDescensoComponent, data: { breadcrumb: 'Editar' } },
          { path: 'vista/:id', component: GoleadoresComponent, data: { breadcrumb: 'Vista' } }, */
          { path: '', redirectTo: 'lista', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BeneficiarioRoutingModule { }
