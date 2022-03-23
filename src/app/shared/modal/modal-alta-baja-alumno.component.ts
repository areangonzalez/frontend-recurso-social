import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { MensajesService, RecursoSocialService } from 'src/app/core/services';

@Component({
  selector: 'modal-alta-baja-alumno-content',
  templateUrl: './modal-alta-baja-alumno.content.html',
})
export class ModalAltaBajaAlumnoContent {
  @Input("datosAlumno") public datosAlumno: any;
  @Input("baja") public baja: boolean;
  public formAltaBajaAlumno: FormGroup;

  constructor( private _fb: FormBuilder, private activeModal: NgbActiveModal, private _recurso: RecursoSocialService, private _msj: MensajesService ) {
    this.formAltaBajaAlumno = _fb.group({
      motivo_baja: ''
    });
  }

  confirmar(baja: boolean) {
    let params: any = {
      recursoid: this.datosAlumno.recursoid,
      alumnoid: this.datosAlumno.id,
      baja: baja,
      motivo_baja: this.formAltaBajaAlumno.get("motivo_baja").value
    };

    this._recurso.bajaAlumno(params).subscribe(
      respuesta => {
        this._msj.exitoso(respuesta.message, [{name:''}]);
        this.activeModal.close(params);
      }, error => { this._msj.cancelado(error, [{name:''}]); }
    )
  }

  cancelar() {
    this.activeModal.close('clsoed');
  }

}

@Component({
  selector: 'modal-alta-baja-alumno-component',
  templateUrl: './modal-alta-baja-alumno.component.html',
})
export class ModalAltaBajaAlumnoComponent {
  @Input("datosAlumno") public datosAlumno: any;
  @Input("baja") public baja: boolean;
  @Output("actualizarDatos") public actualizarDatos = new EventEmitter();

  constructor( private modalService: NgbModal, private config: NgbModalConfig ) {
    config.backdrop = 'static';
    config.keyboard = true;
  }

  abrirModal() {
    const modalRef = this.modalService.open(ModalAltaBajaAlumnoContent, {  centered: true });
    modalRef.componentInstance.datosAlumno = this.datosAlumno;
    modalRef.componentInstance.baja = this.baja;
    modalRef.result.then(
      (result) => {
        if (result == 'closed'){
        }else{
          // obtengo el resultado de la operación.
          return this.actualizarDatos.emit(result);
        }
      }
    )
  }

}
