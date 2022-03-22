import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'sahred-modal-borrar-cuota-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Confirmar Borrado de Cuota</h4>
    </div>
    <div class="modal-body text-center">
      <p class="mt-3">¿Esta seguro que desea borrar la cuota?</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="confirmacion(false)">No</button>
      <button type="button" class="btn btn-success" (click)="confirmacion(true)">Si</button>
    </div>
    `
})
export class BorrarCuotaContent {

  constructor(private activeModal: NgbActiveModal) { }
  // se confirma el borrado de la cuota
  confirmacion(confirmar: boolean) {
    this.activeModal.close(confirmar);
  }
}

@Component({
  selector: 'shared-modal-borrar-cuota',
  templateUrl: './borrar-cuota.component.html',
  styleUrls: ['./borrar-cuota.component.sass']
})
export class BorrarCuotaComponent {
  @Output("confirmarBorrado") public confirmarBorrado = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private config: NgbModalConfig,
  ) {
    config.backdrop = 'static';
    config.keyboard = true;
  }

  abrirModal() {
    const modalReference = this.modalService.open(BorrarCuotaContent, { centered: true });
    modalReference.result.then(
      respuesta => {
        return this.confirmarBorrado.emit(respuesta);
      }
    );
  }
}
