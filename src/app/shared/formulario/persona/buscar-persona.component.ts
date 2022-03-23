import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PersonaService, MensajesService, ConfiguracionParaPaginarService } from 'src/app/core/services';
import { ModalConfig, BotonDisenio, ConfigurarPagina } from 'src/app/core/models';



@Component({
  selector: 'shared-buscar-persona',
  templateUrl: './buscar-persona.component.html',
  styleUrls: ['./buscar-persona.component.sass'],
})
export class BuscarPersonaComponent implements OnInit {
  @Input("esAlumno") public esAlumno: boolean = false;
  @Output("personaElegida") public personaElegida = new EventEmitter();
  public busqueda = "";
  public listaPersonas: any = [];
  public configModal: ModalConfig = {title:"Crear beneficiario"};
  public botonAgregar: BotonDisenio = {class: "btn btn-success", iconoClass: "fas fa-user-plus",  text: ""};
  public configPaginacion: ConfigurarPagina = new ConfigurarPagina(); // obteiene el objeto de configuracion de rango y paginado de comprobantes
  public filtradoBusqueda: any = {};
  public configModalEdicion: ModalConfig = { title: "Editar beneficiario" };
  public configBotonModal: BotonDisenio = { class: 'btn btn-sm btn-light', iconoClass: 'fas fa-pencil-alt', text:'' };

  constructor(
    private _cd: ChangeDetectorRef,
    private _personaService: PersonaService,
    private _mensajeService: MensajesService, private _configuracionPaginacion: ConfiguracionParaPaginarService
  ){}

  ngOnInit(){}
  /**
   * Realiza la busqueda de una persona con o sin parametros establecidos
   * @param params objeto que contiene los parametros a buscar
   * @param pagina numero de pagina
   */
  public buscar(params:object, pagina:number){
    Object.assign(params, { page: pagina-1, pagesize: 8 });
    this._personaService.buscar(params).subscribe(
      datos => {
        this.prepararListadoPersona(datos, pagina);
      }, error => { this._mensajeService.cancelado(error, [{name:''}]); });
  }

  public actualizarBusqueda(palabra: string) {
    this.busqueda = palabra;
    this.buscar({ global_param: palabra }, 1);

  }
  /**
   * prepara la configuracion de paginado para el listado de persona
   * @param listado datos obtenidos del api
   * @param pagina numero de pagina
   */
  public prepararListadoPersona(listado:any, pagina: number) {
    // preparo la variable con la configuracion para el paginado
    this.configPaginacion = this._configuracionPaginacion.config(listado, pagina);
    this.listaPersonas = listado.resultado;
  }
  /**
   * selecciona una persona y se envian los datos al componente padre
   * @param id identificador de la persona
   * @param persona datos de la persona
   */
  public seleccionarPersona(id, persona){
    const datos: object = {id:id, persona: persona};
    this.personaElegida.emit(datos);
  }
  /**
   * Crea un texto plano de la informacion de un lugar
   * @param lugar direccion de una persona
   */
  public direccion(lugar){
    let dir = "";
    dir += lugar['localidad'];
    dir += (lugar['barrio'] != '') ? " - " + lugar['barrio'] : '';
    dir += ' - ' + lugar['calle'] + ' ' + lugar['altura'];
    dir += (lugar['escalera'] != '') ? ' - Esc/Mod: ' + lugar['escalera'] : '';
    dir += (lugar['piso'] != '') ? ' - Piso: ' + lugar['piso'] : '';
    dir += (lugar['depto'] != '') ? ' - Dpto: ' + lugar['depto'] : '';

    return dir;
  }
  /**
   * Cambia la pagina del listado
   * @param page numero de pagina
   */
  public cambioPagina(page: number){
    this.buscar({ global_param: this.busqueda }, page);
  }
  /**
   * Crea la persona enviando los datos al componente padre
   * @param personaid identificador de la persona
   */
  public personaCreada(personaid) {
    const datos: object = {id: personaid};
    this.personaElegida.emit(datos);
  }
  /**
   * Obtiene los datos para editar a una persona
   * @param personaid identificador de la persona
   */
   public personaEditada(personaid){
    this._personaService.personaPorId(personaid).subscribe(
      datos => {
        this.actualizarBusqueda(datos["nro_documento"]);
      }, error => {
        this._mensajeService.cancelado(error, [{name:''}]);
      })
  }
  /**
   * limpia el listado de busqueda
   */
  limpiarBusqueda() {
    this.busqueda = "";
    this.listaPersonas = [];
    this.configPaginacion.colleccionSize = 0;
    this.configPaginacion.page = 1;
  }
}
