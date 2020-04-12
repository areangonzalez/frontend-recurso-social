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
  @Input("programaid") public programaid: any;
  @Input("personaid") public personaid: any;
  @Output("cancelar") public cancelar = new EventEmitter();
  @Output("obtenerDatos") public obtenerDatos = new EventEmitter();

  public formRecurso: FormGroup;
  public programaLista: any = [];
  public listaTipoRecursoAux: any = [];
  public emprender: boolean = false;
  public listaAlumnos = [];
  public submitted = false;
  public programaNombreSeleccionado: string = '';

  constructor(
    private _fb: FormBuilder,
    private _utilService: UtilService,
    private _tipoRecursoService: TipoRecursoService,
    private _mensajeService: MensajesService,
    private _programaService: ProgramaService,
    private _personaService: PersonaService,
    private _configNgbDate: NgbDatepickerConfig,

  ) {
    // configuro la fecha minima
    _configNgbDate.minDate = {year: 1900, month: 1, day: 1};
    // formulario de recurso
    this.formRecurso = _fb.group({
      programaid: ['', Validators.required],
      tipo_recursoid: ['', Validators.required],
      proposito: ['', Validators.required],
      fechaAlta: ['', Validators.required],
      fecha_alta: '',
      monto: ['', Validators.required],
      observacion: '',
      referente: '',
      cant_modulo: ['', Validators.required],
      tipo_responsableid: ['', Validators.required],
      responsableid: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.listaTipoRecursoAux = this.listaTipoRecurso;
    if (this.programaid) {
      let id: number = parseInt(this.programaid);
      // actualizo el listado de programas
      this.formRecurso.controls.programaid.patchValue(id);
      this.listarTipoRecurso(id);
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

    if (this.formRecurso.invalid) {
      this._mensajeService.cancelado("Campos sin completar!! Por favor verifique el formulario.", [{name:''}]);
      return;
    }else{
      let recurso:object = this.formRecurso.value;
      let alumno: any[] = [];
      if (this.emprender){ // si es programa emprender
        if (this.listaAlumnos.length > 0){
          for (let i = 0; i < this.listaAlumnos.length; i++) {
            alumno.push({ alumnoid: this.listaAlumnos[i].id });
          }
          recurso["alumno_lista"] = alumno;
          this.obtenerDatos.emit(recurso);
        }else{
          this._mensajeService.cancelado('La lista de alumnos deberia de tener al menos una persona.', [{name:''}]);
          return;
        }
      }else{ // si no es programa emprender
        this.obtenerDatos.emit(this.formRecurso.value);
      }
    }
  }
  /**
   * verifica si la seleccion del programa es emprender
   * @param event valor que obtiene del option de programa
   */
  public esEmprender(event:any){
    // obtengo el nombre del programa
    let selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    this.emprender = (selectElementText.toLowerCase() === "emprender") ? true : false;
    // verifico el programa que selecciono
    this.programaSeleccionado(selectElementText);
  }

  public programaSeleccionado(nombrePrograma: string) {
    this.programaNombreSeleccionado = nombrePrograma.toLocaleLowerCase();
  }

}
