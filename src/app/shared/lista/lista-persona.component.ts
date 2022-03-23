import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'shared-lista-persona',
  templateUrl: './lista-persona.component.html',
  styleUrls: []
})
export class ListaPersonaComponent implements OnInit {
  @Input("personas") public personas:any;
  @Input("mostrar") public mostrar:boolean;
  @Input("esAlumno") public esAlumno:boolean = false;
  @Output("borrarPersona") public borrarPersona = new EventEmitter();

  constructor(){}

  ngOnInit() {
  }


  borrar(id:number){
    this.borrarPersona.emit({id:id});
  }

  public direccion(lugar: object){
    let dir = "";
      dir += lugar['localidad'];
      dir += (lugar['barrio'] != '') ? ' - ' + lugar['barrio'] : ''
      dir += (lugar['calle'] != '') ? ' - ' + lugar['calle'] + ' ' + lugar['altura'] : '';
      dir += (lugar['escalera'] != '') ? ' - ' + lugar['escalera'] : '';
      dir += (lugar['piso'] != '') ? ' - ' + lugar['piso'] : '';
      dir += (lugar['depto'] != '') ? ' - ' + lugar['depto'] : '';

    return dir;
  }

  public confirmarBajaAltaAlumno(datosAlumno: any) {
    for (let i = 0; i < this.personas.length; i++) {
      if (this.personas[i].id == datosAlumno['alumnoid']) {
        this.personas[i].baja = datosAlumno['baja'];
        this.personas[i].motivo_baja = (datosAlumno['baja'])?datosAlumno['motivo_baja']:'';

      }
    }
    return this.personas;
  }
}
