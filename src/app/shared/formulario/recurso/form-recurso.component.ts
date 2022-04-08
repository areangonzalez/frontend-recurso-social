import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilService } from 'src/app/core/utils';
import { TipoRecursoService, MensajesService, ProgramaService, PersonaService } from 'src/app/core/services';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'shared-form-recurso',
  templateUrl: './form-recurso.component.html',
  styleUrls: ['./form-recurso.component.sass']
})
export class FormRecursoComponent implements OnInit {
  @Input("listaPrograma") public listaPrograma: any;
  @Input("listaTipoRecurso") public listaTipoRecurso: any;
  @Input('listaTipoResponsable') public listaTipoResponsable: any;
  @Input('listaLocalidades') public listaLocalidades: any;
  @Input("programaid") public programaid: any;
  @Input("personaid") public personaid: any;
  @Output("cancelar") public cancelar = new EventEmitter();
  @Output("obtenerDatos") public obtenerDatos = new EventEmitter();

  public formRecurso: FormGroup;
  public programaLista: any = [];
  public listaTipoRecursoAux: any = [];
  public emprenderOrecrear: boolean = false;
  public esEmprender: boolean = false;
  public listaAlumnos = [];
  public submitted = false;
  public submittedMA = false;
  public submittedPrestacion = false;
  public programaSeleccionadoId: string = '';

  constructor(
    private _fb: FormBuilder,
    private _utilService: UtilService,
    private _mensajeService: MensajesService,
    private _personaService: PersonaService,
    private _configNgbDate: NgbDatepickerConfig,

  ) {
    // configuro la fecha minima
    _configNgbDate.minDate = {year: 1900, month: 1, day: 1};
    // formulario de recurso
    this.formRecurso = _fb.group({
      programaid: ['', Validators.required],
      tipo_recursoid: ['', Validators.required],
      localidadid: ['', Validators.required],
      prestacion: _fb.group({
        proposito: ['', Validators.required],
        fechaAlta: ['', Validators.required],
        fecha_alta: '',
        fechaFinal: '',
        fecha_final: '',
        monto: ['', Validators.required],
        monto_mensual: '',
        cuota: ['', Validators.required]
      }),
      modulo_alimentar: _fb.group({
        fechaAlta: ['', Validators.required],
        fecha_alta: '',
        referente: '',
        cant_modulo: ['', Validators.required],
        tipo_responsableid: ['', Validators.required],
        responsable_entregaid: ['', Validators.required],
        monto: ['', Validators.required]
      }),
      lugar_capacitacion: '',
      observacion: ''
    });
  }

  ngOnInit() {
    this.listaTipoRecursoAux = this.listaTipoRecurso;
    if (this.programaid) {
      let id: number = parseInt(this.programaid);
      // actualizo el listado de programas
      this.formRecurso.get("programaid").patchValue(this.programaid);
      this.listarTipoRecurso(id);
      this.emprenderOrecrear = (this.programaid == 3 || this.programaid == 7) ? true : false;
      this.esEmprender = (this.programaid == 3) ? true : false;
    }
  }

  get datosRecurso(){ return this.formRecurso.controls; }
  /**
   * valido si es un numero
   * @param datos valor a verificar si es un numero
   */
  public validadrNumero(datos){
    if (!this._utilService.validarNumero(datos.value)) {
      datos.value = datos.value.substring(0,datos.value.length - 1);
    }
  }
  /**
   * listo los tipo de recursos a traves de la seleccion de un programa localmente
   * @param programaid identificador de programa
   */
  public listarTipoRecurso(programaid:any) {
    this.formRecurso.controls.tipo_recursoid.setValue('');
    this.formRecurso.get('prestacion').reset();
    this.formRecurso.get('prestacion').get('cuota').setValue('');
    this.formRecurso.get('modulo_alimentar').reset();
    this.formRecurso.get('modulo_alimentar').get('tipo_responsableid').setValue('');
    this.formRecurso.get('modulo_alimentar').get('responsable_entregaid').setValue('');
    this.formRecurso.get('localidadid').setValue('');
    this.programaSeleccionadoId = programaid;
    if (programaid != ''){
      for (let i = 0; i < this.listaPrograma.length; i++) {
        if (parseInt(programaid) == this.listaPrograma[i].id) {
          this.listaTipoRecurso = this.listaPrograma[i].lista_tipo_recurso;
        }
      }
    }else{
      this.listaTipoRecurso = this.listaTipoRecursoAux;
    }
  }
  /**
   * agreo alumnos al listado de emprender, evitando duplicaciones de las personas
   * @param alumno datos del alumno a agregar
   */
  public agregarAlumnos(alumno:any){
    if (this.personaid != undefined) {
      if ( alumno.id !== this.personaid ){
        if (this.alumnoDuplicado(alumno.id) === true){
          this.buscarPersonaPorId(alumno.id);
        }else{
          this._mensajeService.cancelado("Este alumno ya fue ingresado.", [{name: ''}]);
        }
      }else{
        this._mensajeService.cancelado("No puede ingresar al beneficiario como un alumno", [{name:''}]);
      }
    }else{
      this._mensajeService.cancelado("Por favor ingrese a un beneficiario.", [{name:''}]);
    }
  }
  /**
   * Me permite verificar si existe la duplicacion del alumno
   * @param id identificador del alumno
   * @return {boolean} devuelve true si existe un duplicado
   *
   */
  private alumnoDuplicado(id:number) {
    let existe = true;
    if (this.listaAlumnos.length > 0){
      for (let i = 0; i < this.listaAlumnos.length; i++) {
        if (this.listaAlumnos[i].id == id) {
          existe = false;
        }
      }
    }
    return existe;
  }
  /**
   * borra un alumno del listado de emprender
   * @param alumno datos del alumno a eliminar
   */
  public borrarAlumno(alumno:any){
    for (let i = 0; i < this.listaAlumnos.length; i++) {
      if (this.listaAlumnos[i].id == alumno.id){
        this.listaAlumnos.splice(i, 1);
      }
    }
  }
  /**
   * busca una persona por su numero de id
   * @param id identificador de persona
   */
  public buscarPersonaPorId(personaid:number){
    this._personaService.personaPorId(personaid).subscribe(
      persona => {
        this.listaAlumnos.push(persona);
      }, error => { this._mensajeService.cancelado(error, [{name:''}]); });
  }
  /**
   * cancelar el formulario notificando la confirmacion
   */
  public cancelarForm(){
    this.cancelar.emit(true);
  }
  /**
   * valida el formulario de prestación
   * enviando los datos al componente padre
   */
  public validarForm(){
    this.submitted = true;
    let recurso: object = {};
    let noError = true;

    switch (this.programaSeleccionadoId.toString()) {
      case '6':
        this.submittedMA = true;
        this.submittedPrestacion = false;
        if (this.formRecurso.get('modulo_alimentar').invalid) {
          this._mensajeService.cancelado("Campos sin completar!! Por favor verifique el formulario.", [{name:''}]);
          return;
        }else {
          recurso = this.armarParametrosPrestacion(this.formRecurso.value, true);
          this.obtenerDatos.emit(recurso);
        }
        break;
      default:
        this.submittedMA = false;
        this.submittedPrestacion = true;
        // validacion de formulario de prestacion
        if (this.formRecurso.get('prestacion').invalid) {
          noError = false;
          this._mensajeService.cancelado("Campos sin completar!! Por favor verifique el formulario.", [{name:''}]);
          return;
        }
        let monto_mensual = this.formRecurso.get("prestacion").get("monto_mensual").value;
        monto_mensual = (monto_mensual == null || monto_mensual == '') ? true : parseFloat(monto_mensual); // si es true es para marcar error
        let fechaFinal: boolean = (this.formRecurso.get("prestacion").get("fechaFinal").value == null) ? true : false;
        let monto = parseFloat(this.formRecurso.get("prestacion").get("monto").value);

        // valido si esta en cuotas
        if ((this.formRecurso.get("prestacion").get("cuota").value == 1) && fechaFinal) {
            noError = false;
            this._mensajeService.cancelado("Campos sin completar!! Por favor verifique el formulario.", [{name:''}]);
            return;
        }
        // se valida si monto mensual tiene algun valor
        if ((this.formRecurso.get("prestacion").get("cuota").value == 1) && monto_mensual == true) {
          noError = false;
          this._mensajeService.cancelado("Campos sin completar!! Por favor verifique el formulario.", [{name:''}]);
          return;
        }

        // valido que monto mensual no sea mayor a monto
        if ((this.formRecurso.get("prestacion").get("cuota").value == 1) && (monto_mensual > monto)){
          noError = false;
          this._mensajeService.cancelado("Por favor verifique que monto mensual NO sea mayor a monto.", [{name:''}]);
          return;
        }

        let listaIdAlumnos = this.armarListaAlumno();
        if (this.esEmprender) {
          if (listaIdAlumnos.length == 0) {
            noError = false
            this._mensajeService.cancelado('La lista de alumnos deberia de tener al menos una persona.', [{name:''}]);
          }
        }

        if (noError) {
          recurso = this.armarParametrosPrestacion(this.formRecurso.value, false);
          if (this.esEmprender) { // si es emprender
            recurso["alumno_lista"] = listaIdAlumnos;
          }
          this.obtenerDatos.emit(recurso);
        }
        break;
    }
  }

  armarParametrosPrestacion(formulario: any, esModuloAlimentar: boolean) {
    let recurso: object = {
      programaid: formulario.programaid, tipo_recursoid: formulario.tipo_recursoid,
      localidadid: formulario.localidadid, observacion: formulario.observacion};
    if (esModuloAlimentar) {
      Object.assign(recurso, formulario.modulo_alimentar);
    }else{
      Object.assign(recurso, formulario.prestacion);
    }
    if (this.emprenderOrecrear) {
      Object.assign(recurso, { "lugar_capacitacion": formulario.lugar_capacitacion});
    }

    return recurso;
  }

  armarListaAlumno() {
    let alumnos: any[] = [];
    if (this.listaAlumnos.length > 0){
      for (let i = 0; i < this.listaAlumnos.length; i++) {
        alumnos.push({ alumnoid: this.listaAlumnos[i].id });
      }
      return alumnos;
    }else{
      return alumnos;
    }
  }

  /**
   * verifica si la seleccion del programa es emprender
   * @param event valor que obtiene del option de programa
   */
  public esEmprenderOrecrear(event:any){
    // obtengo el nombre del programa
    let selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    this.emprenderOrecrear = (selectElementText.toLowerCase() === "emprender" || selectElementText.toLowerCase() === "recrear") ? true : false;
    this.esEmprender = (selectElementText.toLowerCase() === "emprender") ? true : false;
  }
}
