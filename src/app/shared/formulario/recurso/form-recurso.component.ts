import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilService } from 'src/app/core/utils';
import { TipoRecursoService, MensajesService, ProgramaService } from 'src/app/core/services';


@Component({
  selector: 'shared-form-recurso',
  templateUrl: './form-recurso.component.html',
  styleUrls: ['./form-recurso.component.sass']
})
export class FormRecursoComponent implements OnInit {

  public formRecurso: FormGroup;
  public programaLista: any = [];
  public tipoPrestacionLista: any = [];
  public emprender: boolean = false;
  public listaAlumnos = [];
  public submitted = false;


  constructor(
    private _fb: FormBuilder,
    private _utilService: UtilService,
    private _tipoRecursoService: TipoRecursoService,
    private _mensajeService: MensajesService,
    private _programaService: ProgramaService
  ) {
    this.formRecurso = _fb.group({
      programaid: ['', Validators.required],
      tipo_recurso_socialid: ['', Validators.required],
      proposito: ['', Validators.required],
      fechaAlta: ['', Validators.required],
      fecha_alta: '',
      monto: ['', Validators.required],
      observacion: ''
    });
  }

  ngOnInit() {
    this.listarProgramas();
  }

  get datosRecurso(){ return this.formRecurso.controls; }


  public formatFechaAlta(objFecha) {
    const fecha:string = this._utilService.formatearFecha(objFecha.day, objFecha.month, objFecha.year, 'yyyy-MM-dd');
    this.formRecurso.controls.fecha_alta.setValue(fecha);
  }

  public validadrNumero(datos){
    if (!this._utilService.validarNumero(datos.value)) {
      datos.value = datos.value.substring(0,datos.value.length - 1);
    }
  }

  public listarProgramas(){
    this._programaService.listar().subscribe(
      programas => {
        this.programaLista = programas;
      }, error => { this._mensajeService.cancelado(error, [{name:''}]); });
  }

  public listarTipoPrestacion(programaid:number) {
    this.emprender = (programaid == 1) ? true : false;

    this._tipoRecursoService.buscarPorPrograma(programaid).subscribe(
      prestacion => {
        this.tipoPrestacionLista = prestacion;
      }, error => this._mensajeService.cancelado(error, [{name:''}]));
  }

  public agregarAlumnos(alumno:any){
    if (this.alumnoDuplicado(alumno.id) === true){
      this.listaAlumnos.push(alumno.persona);
    }else{
      this._mensajeService.cancelado("Este alumno ya fue ingresado.", [{name: ''}]);
    }
  }

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

  borrarAlumno(alumno:any){
    for (let i = 0; i < this.listaAlumnos.length; i++) {
      if (this.listaAlumnos[i].id == alumno.id){
        this.listaAlumnos.splice(i, 1);
      }
    }
  }
}
