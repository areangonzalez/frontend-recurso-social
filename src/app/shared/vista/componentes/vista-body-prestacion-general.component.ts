import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shared-vista-body-prestacion-general',
  templateUrl: './vista-body-prestacion-general.component.html',
  styleUrls: ['./vista-body-prestacion-general.component.sass']
})
export class VistaBodyPrestacionGeneralComponent implements OnInit {
  @Input("recurso") public recurso: any;
  constructor() { }

  ngOnInit() {
    if (this.recurso["alumno_lista"] !== undefined && this.recurso["alumno_lista"].length !== 0) {
      this.armarDatosAlumno();
    }
  }

  armarDatosAlumno() {
    for (let i = 0; i < this.recurso["alumno_lista"].length; i++) {
      {
        this.recurso["alumno_lista"][i]["recursoid"] = this.recurso.id;
      }
    }
  }

}
