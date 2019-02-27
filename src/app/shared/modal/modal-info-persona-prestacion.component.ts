import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfig, BotonDisenio } from 'src/app/core/models';

@Component({
  selector: 'modal-info-persona-prestacion-content',
  templateUrl: './modal-info-persona-prestacion-content.html'
})
export class ModalInfoPersonaPrestacionContent {
  @Input("configModal") public configModal:ModalConfig;
  @Input("personaid") public personaid: any;

  constructor(public activeModal: NgbActiveModal) {}
  /**
   * Envio el id de persona al componente padre del modal-content
   * @param personaid identificador de la persona que ha sido guardada
   */
  public guardar(personaid:any) {
    this.activeModal.close(personaid);
  }
  /**
   * cancelo el modal y lo cierro.
   * @param cancelar cierra el modal si el valor es true
   */
  public cancelar(cancelar:boolean) {
    this.activeModal.close('closed');
  }
}

@Component({
  selector: 'modal-info-persona-prestacion-component',
  templateUrl: './modal-info-persona-prestacion.component.html',
  providers: [NgbModalConfig, NgbModal]

})
export class ModalInfoPersonaPrestacionComponent {
  /**
   * @var disenioBoton {Object} define el diseño del boton por Ej.: {class: "", iconoClass: "",  text: ""}
   * @var configModal {Object} define la configuracion del modal y diseño Ej.: {title: ""}
   * @var personaid {number} identificador de una persona
   * @function {Object} devuelve los datos de la persona
   */
  // @Input("disenioBoton") public disenioBoton: BotonDisenio;
  // @Input("configModal") public configModal: ModalConfig;
  @Input("texto") public texto: string;
  @Input("personaid") public personaid: any;
  //@Output("obtenerPersona") public obtenerPersona = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private config: NgbModalConfig
  ) {
    config.backdrop = true;
    config.keyboard = true;
  }

  open() {
    const modalRef = this.modalService.open(ModalInfoPersonaPrestacionComponent, {size: 'lg'});
    //modalRef.componentInstance.configModal = this.configModal;
    modalRef.componentInstance.personaid = this.personaid;
    modalRef.result.then(
      (result) => {
        if (result == 'closed'){
        }else{
          // obtengo el id persona desde el content.
      //    return this.obtenerPersona.emit(result);
        }
      }
    )
  }
}
