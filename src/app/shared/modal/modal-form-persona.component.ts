import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfig, BotonDisenio } from 'src/app/core/models';

@Component({
  selector: 'modal-form-persona-content',
  templateUrl: './modal-form-persona-content.html'
})
export class ModalFormPersonaContent {
  @Input("configModal") public configModal:ModalConfig;
  @Input("personaid") public personaid: any;
  @Input("esAlumno") public esAlumno: boolean = false;

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
  selector: 'modal-form-persona-component',
  templateUrl: './modal-form-persona.component.html',
  providers: [NgbModalConfig, NgbModal]
})
export class ModalFormPersonaComponent {
  /**
   * @var disenioBoton {Object} define el diseño del boton por Ej.: {class: "", iconoClass: "",  text: ""}
   * @var configModal {Object} define la configuracion del modal y diseño Ej.: {title: ""}
   * @var personaid {number} identificador de una persona
   * @function {Object} devuelve los datos de la persona
   */
  @Input("disenioBoton") public disenioBoton: BotonDisenio;
  @Input("configModal") public configModal: ModalConfig;
  @Input("personaid") public personaid: any;
  @Input("esAlumno") public esAlumno: boolean = false;
  @Output("obtenerPersona") public obtenerPersona = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open() {
    const modalRef = this.modalService.open(ModalFormPersonaContent, {windowClass: 'ventana-xl'});
    modalRef.componentInstance.configModal = this.configModal;
    modalRef.componentInstance.personaid = this.personaid;
    modalRef.componentInstance.esAlumno = this.esAlumno;
    modalRef.result.then(
      (result) => {
        if (result == 'closed'){
        }else{
          // obtengo el id persona desde el content.
          return this.obtenerPersona.emit(result);
        }
      }
    )
  }
}
