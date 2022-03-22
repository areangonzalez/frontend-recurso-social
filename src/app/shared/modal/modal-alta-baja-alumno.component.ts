import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'modal-alta-baja-alumno-content',
  templateUrl: './modal-alta-baja-alumno.content.html',
})
export class ModalAltaBajaAlumnoContent {
  public formAltaBajaAlumno: FormGroup;

  constructor( private _fb: FormBuilder, private activeModal: NgbActiveModal ) {
    this.formAltaBajaAlumno = _fb.group({
      motivo_baja: ''
    });
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
  @Output("actualizarDatos") public actualizarDatos: any;

  constructor( private modalService: NgbModal, private config: NgbModalConfig ) {
    config.backdrop = 'static';
    config.keyboard = true;
  }

  abrirModal() {
    const modalRef = this.modalService.open(ModalAltaBajaAlumnoContent, {  centered: true });
    modalRef.componentInstance.datosAlumno = this.datosAlumno;
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
