import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilService } from 'src/app/core/utils';
import { SexoService, GeneroService, EstadoCivilService, MensajesService, PersonaService } from 'src/app/core/services';
import { PersonaModel } from 'src/app/core/models';
import { map, catchError } from "rxjs/operators";
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'shared-form-persona',
  templateUrl: './form-persona.component.html',
  styleUrls: ['./form-persona.component.sass']
})
export class FormPersonaComponent implements OnInit {
  /**
   * @var personaid identificador de la persona
   * @var getDatos evento que consigue datos para el componente padre
   * @var cancelarForm evento que ejecuta la cancelación del formulario
   */
  @Input("personaid") public personaid: number;
  @Output("getDatos") public getDatos = new EventEmitter();
  @Output("cancelarForm") public cancelarForm = new EventEmitter();
  /**
   * @var formPersona [FormGroup] contiene las variables que conforman el formulario
   * @var submitted [boolean] permite mostrar los mensajes de errores del formulario
   * @var sexoLista [array] listado de sexos
   * @var generoLista [array] listado de generos
   * @var estadoCivilLista [array] listado de estados civiles
   * @var personaModel [model] modelo de persona
   * @var cuil_medio [string] guarda el número de documento que conforma el cuil
   * @Var listaRedSocial [array] listado que guarda redes sociales de una persona
   */
  public formPersona: FormGroup;
  public submitted: boolean = false;
  public sexoLista: any = [];
  public generoLista: any = [];
  public estadoCivilLista: any = [];
  public personaModel = new PersonaModel();
  public cuil_medio:string = '';
  public listaRedSocial: any = [];

  /**
   * constructor
   * @param _fb construye el formulario
   * @param _util gestiona funciones utiles para aplicar formatos.
   * @param _mensajeService gestiona los mensajes para el cliente
   * @param _sexoService servicio para obtener los sexos
   * @param _generoService servicio para obtener los generos
   * @param _estadoCivilService servicio para obtener los estados civiles
   * @param _personaService servicio para obtener/crear/editar persona
   */
  constructor(
    private _fb: FormBuilder,
    private _util: UtilService,
    private _mensajeService: MensajesService,
    private _sexoService: SexoService,
    private _generoService: GeneroService,
    private _estadoCivilService: EstadoCivilService,
    private _personaService: PersonaService,
    private _configNgbDate: NgbDatepickerConfig
  ){
    // configuracion de fecha minima
    _configNgbDate.minDate = {year: 1950, month: 1, day: 1};
    // formulario de persona
    this.formPersona = _fb.group({
        id: '',
        nro_documento: ['', [Validators.required, Validators.minLength(7)]],
        apellido: ['', [Validators.required, Validators.minLength(3)]],
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        cuil: '',
        cuil_prin: '',
        cuil_fin: '',
        fecha_nacimiento: '',
        fechaNacimiento: ['', Validators.required],
        sexoid: '',
        generoid: '',
        estado_civilid: '',
        contacto: _fb.group({
          telefono: '',
          celular: '',
          email: ['', [Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        }),
        lugar: _fb.group({
          id: '',
          localidadid: ['', Validators.required],
          calle: ['', [Validators.required, Validators.minLength(3)]],
          altura: ['', Validators.required],
          barrio: '',
          piso: '',
          depto: '',
          escalera: ''
        })
    });
  }

  ngOnInit() {
    this.listarSexo();
    this.listarGenero();
    this.listarEstadoCivil();
    if (this.personaid !== undefined) {
      this.personaPorId(this.personaid);
    }
  }

  // convenience getter for easy access to form fields
  get datosPersona() { return this.formPersona.controls; }

  /**
   * @function soloNumero valida que los datos ingresados en un input sean solo numeros.
   * @param datos objeto que contiene los datos de un input.
   */
  public soloNumero(datos:any){
    if (!this._util.validarNumero(datos.value)) {
      datos.value = datos.value.substring(0,datos.value.length - 1);
    }
  }
  /**
   * @function validarCuil valida el numero de cuil que esta en el medio
   * @param nroDocumento número de documento para ser validado.
   */
  public validarCuil(nroDocumento:string) {
    if (nroDocumento.length == 7) {
      this.cuil_medio = '0' + nroDocumento;
    }else{
      this.cuil_medio = nroDocumento;
    }
    this.armarCuil();
  }
  /**
   * @function armarCuil funcion que arma el cuil uniendo las variables de los formularios
   */
  public armarCuil(){
    const cuil_primero = this.formPersona.value.cuil_prin;
    const cuil_ult = this.formPersona.value.cuil_fin;
    // verifico si las variables son distintas a vacio
    // si la validacion es correcta seteo el valor del formulario con el cuil armado
    if (cuil_primero != '' && cuil_ult != '') {
        return this.formPersona.controls.cuil.setValue(cuil_primero + this.cuil_medio + cuil_ult);
    }else{ // si esta vacio seteo el valor del formulario en vacion
        return this.formPersona.controls.cuil.setValue('');
    }
  }

  /**
   * @function formatFechaNaciento convierte la fecha en un string
   * @param obj la fecha viene en formato objeto
   */
  public formatFechaNacimiento(obj:any){
    this.formPersona.controls.fecha_nacimiento.setValue(this._util.formatearFecha(obj.day, obj.month, obj.year, "yyyy-MM-dd"));
  }
  /**
   * @function obtenerIdPersona Envio el id de persona al modal.
   * @param personaid identificador de la persona guardada.
   */
  public obtenerIdPersona(personaid:number){
    this.getDatos.emit(personaid);
  }

  /* Funcionalidad para los listados */

  /**
   * @function listarSexo obtengo el listado de sexos para el select del formulario
   */
  public listarSexo(){
    this._sexoService.listar().subscribe(
      datos => { this.sexoLista = datos; },
      error => { this._mensajeService.cancelado(error, [{name:''}]); });
  }
  /**
   * @function listarGenero obtengo el listado de generos para el select del formulario
   */
  public listarGenero(){
    this._generoService.listar().subscribe(
      datos => { this.generoLista = datos; },
      error => { this._mensajeService.cancelado(error, [{name:''}]); });
  }
  /**
   * @function listarEstadoCivil obtengo el listado de estados civiles para el select del formulario
   */
  public listarEstadoCivil(){
    this._estadoCivilService.listar().subscribe(
      datos => { this.estadoCivilLista = datos; },
      error => { this._mensajeService.cancelado(error, [{name:''}]); });
  }
  /**
   * @function validarPersona valido la persona mediante el submitt del formulario
   */
  public validarPersona() {
    this.submitted = true;
    if (!this._util.validarUltimoDigitoCuil(this.formPersona.get("cuil").value)) {
      this._mensajeService.cancelado("El numero de cuil es incorrecto, Por favor verifique el Número de Documento o los digitos de CUIL.", [{name:''}]);
      return;
    }
    if (this.formPersona.invalid) { // verifico la validación en los campos del formulario
      if (this.formPersona.get('contacto').value.email !== this.formPersona.get('contacto').value.email.toLowerCase()){
        this._mensajeService.cancelado("El email no puede estar en mayusculas!!", [{name:''}]);
      }else{
        this._mensajeService.cancelado("Campos sin completar!!", [{name:''}]);
      }
      return;
    }else{ // si pasa la validación
      if (this.formPersona.get('cuil').value.length < 10){
        this.formPersona.get('cuil').setValue('');
      }
      let id = this.formPersona.value.id;
      let persona = this.personaModel.deserealize(this.formPersona.value);
      this.guardarPersona(persona,id);
    }
  }
  /**
   * @function guardarPersona Crear/Editar una persona.
   */
  public guardarPersona(params:object, id:any) {
    Object.assign(params, {'lista_red_social': this.listaRedSocial});
    if (id != '') {
      this._personaService.guardar(params, id).subscribe(
        resultado => {
          this.obtenerIdPersona(id);
          this._mensajeService.exitoso("Se han actualizado los datos de la persona con éxito.", [{name:''}]);
        }, error => { this._mensajeService.cancelado(error, [{name: ''}]); });
    }else{
      this._personaService.guardar(params, 0).subscribe(
        resultado => {
          this.obtenerIdPersona(resultado.data.id);
          this._mensajeService.exitoso("Se ha guardado la persona con éxito.", [{name:''}]);
        }, error => {
          this._mensajeService.cancelado(error, [{name:''}]);
        });
    }
  }
  /**
   * @function cancelar el formulario enviando un dato booleano para el cierre del modal.
   */
  public cancelar(){
    this.cancelarForm.emit(true);
  }
  /**
   * @function personaPorId obtengo la persona mediante su id para editarla
   * @param personaid identificador de una persona
   */
  public personaPorId(personaid) {
    this._personaService.personaPorId(personaid)
    .pipe(map(vPersona => {
      let vDatos = {};
      // agrego los datos que pertenecen a contacto y los borro del objeto de persona
      vDatos = vPersona;
      vDatos["contacto"] = {};

      vDatos["contacto"]["telefono"] = vPersona["telefono"];
      delete vDatos["telefono"];
      vDatos["contacto"]["celular"] = vPersona["celular"];
      delete vDatos["celular"];
      vDatos["contacto"]["email"] = vPersona["email"];
      delete vDatos["email"];
      this.listaRedSocial = vPersona["lista_red_social"];
      delete vDatos["lista_red_social"];
      // armo numero de cuil
      if (vPersona["cuil"] != '') {
        vDatos["cuil_prin"] = vPersona["cuil"].substring(0, 2);
        vDatos["cuil_fin"] = vPersona["cuil"].substring(10);
        this.cuil_medio = vPersona["nro_documento"];
      }
      this.validarCuil(vPersona["nro_documento"]);
      // verifico que exista y armo la fecha de nacimiento
      if (vPersona["fecha_nacimiento"] != '') {
        let fecha = vPersona["fecha_nacimiento"].split("-");
        vDatos["fechaNacimiento"] = { year: parseInt(fecha[0]), month: parseInt(fecha[1]), day: parseInt(fecha[2]) };
      }

      return vDatos;
    }))
    .subscribe(
      persona => {
        this.formPersona.patchValue(persona);
      }, error => { this._mensajeService.cancelado(error, [{name: ''}]) });
  }

}
