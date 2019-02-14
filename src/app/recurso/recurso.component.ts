import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { MensajesService, PersonaService, RecursoSocialService } from '../core/services';

@Component({
  selector: 'app-recurso',
  templateUrl: './recurso.component.html',
  styleUrls: ['./recurso.component.sass']
})
export class RecursoComponent implements OnInit {
  public infoPersona:boolean = false;
  public datosPersona:any = {};
  public contactosForm: FormGroup;
  public programaid: any;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _mensajeService: MensajesService,
    private _personaService: PersonaService,
    private _recursoService: RecursoSocialService
  ){
    this.contactosForm = _fb.group({
      contacto: _fb.group({
        telefono: '',
        celular: '',
        email: ['', [Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        red_social: ''
      })});
  }

  ngOnInit() {
    this.programaid = this._route.snapshot.paramMap.get('programaid');
  }

  public seleccionarPersona(datos){
    if (datos.persona != undefined) {
      this.infoPersona = true;
      this.datosPersona = datos.persona;
      this.contactosForm.controls.contacto.patchValue(datos.persona);
    }
  }

  public cambiarPersona(){
    this.datosPersona = {};
    this.infoPersona = false;
    this.contactosForm.reset();
  }

  public editarPersona(){
    console.log("Hacer algo");
  }

  public guardar(recurso:object) {
    if (this.datosPersona.id !== undefined ) {
      // agrego el id de persona
      recurso["personaid"] = this.datosPersona.id;
      recurso["monto"] = parseFloat(recurso["monto"]);

      this._personaService.guardar(this.contactosForm.value.contacto, this.datosPersona.id).subscribe(
        resultado =>{
          this.guardarRecurso(recurso);
        }, error => { this._mensajeService.cancelado(error, [{name: ''}]); });

    }else{
      this._mensajeService.cancelado("Disculpe, aun NO se ha seleccionado una persona.", [{name:''}]);
    }

    console.log(recurso);
  }

  public cancelar(cancela:boolean) {
    if(cancela) {
      this._router.navigate(['inicio']);
    }
  }

  public guardarRecurso(params:object){
    this._recursoService.guardar(params, 0).subscribe(
      resultado => {
        this._mensajeService.confirmar("Se ha guardado correctamente la prestación", [{name: 'inicio/vista', param:resultado["id"], tipo:'vista'}]);
      }, error => { this._mensajeService.cancelado(error, [{name: ''}]); });
  }
}
