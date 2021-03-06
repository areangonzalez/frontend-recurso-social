import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'shared-lista-red-social',
  templateUrl: './lista-red-social.component.html',
  styleUrls: []
})
export class ListaRedSocialComponent implements OnInit {
  @Input("redesSociales") public listadoRedSocial:any;
  //public listadoRedSocial:any = [];

  constructor(){}

  ngOnInit() {
  }
  /**
   * agrego un nuevo elemento al listado de red social
   * @param redSocial datos de una red social
   */
  public agregarRedSocial(redSocial:any) {
    this.listadoRedSocial.push(redSocial);
  }

  borrar(id:number, confirmacion: boolean){
    if (confirmacion){
      this.listadoRedSocial.splice(id, 1);
    }
  }
}
