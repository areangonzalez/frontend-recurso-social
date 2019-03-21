import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
// importo los datos JSON
import * as data from '../../../assets/data/data.json';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        function sum(nums) {
          return nums.reduce((a, b) => a + b)
        }

        function getPersonas(){
          let personas = (<any>data).personas;
          let existe = false;
          if (localStorage.getItem('personas')) {
            let personaStorage: any[] = JSON.parse(localStorage.getItem('personas'));
            for (let j = 0; j < personaStorage.length; j++) {
              for (let i = 0; i < personas.length; i++) {
                if (personas[i].id === personaStorage[j].id){
                  personas[i] = personaStorage[j]; // actualizo los datos
                  existe = true;
                }
              }
              if(!existe){ // si no existe la persona la agrego
                personas.push(personaStorage[j]);
              }
            }
          }

          return personas;
        }

        function getRecursos(){
          let recursos = (<any>data).recursos;
          let existe = false;
          if(localStorage.getItem("recursos")) {
            let recursoStorage: any[] = JSON.parse(localStorage.getItem("recursos"));
            for (let i = 0; i < recursoStorage.length; i++) {
              for (let j = 0; j < recursos.length; j++) {
                if (recursoStorage[i].id === recursos[j].id){
                  recursos[j] = recursoStorage[i]; // si se edito
                  existe = true;
                }
              }
              if (!existe) {
                recursos.push(recursoStorage[i]);
              }
            }
          }

          return recursos;
        }

        function nombrePorId(id, lista){
          for (let i = 0; i < lista.length; i++) {
            if (lista[i].id == id){
              return lista[i].nombre;
            }
          }
        }

        function hoy() {
          let fecha = new Date();
          return fecha.getFullYear() + '-' + fecha.getMonth() + '-' + fecha.getDate();
        }


        // array in local storage for registered users
        let users: any[] = JSON.parse(localStorage.getItem('users')) || [];
        let personas = getPersonas();
        let recursos = getRecursos();
        let programas = (<any>data).programas;
        let localidades = (<any>data).localidads;
        let tipoRecurso = (<any>data).tipoRecursoSocials;
        let sexos = (<any>data).sexos;
        let generos = (<any>data).generos;
        let estadoCivil = (<any>data).estadoCivils;

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {
            // obtener reurso por ID
            if(request.url.match(/\/apimock\/recursos\/\d+$/) && request.method === 'GET') {
              let urlParts = request.url.split('/');
              let id = parseInt(urlParts[urlParts.length - 1]);
              console.log("recurso id: ",id);
              let recurso = recursos.filter(recurso => { return recurso.id === id; });
              let recursoEncontrado = recurso.length ? recurso[0] : null;
              let alumnos: any[] = [];
              if(recursoEncontrado["alumno_lista"]!== undefined) {
                for (let i = 0; i < recursoEncontrado["alumno_lista"].length; i++) {
                  let encontrado = personas.filter(alumno => { return alumno.id === recursoEncontrado["alumno_lista"][i].alumnoid; });
                  alumnos.push(encontrado[0]);
                }

                recursoEncontrado["alumno_lista"] = alumnos;
              }

              let personaEncontrada = personas.filter(persona => { return persona.id === recursoEncontrado["personaid"]; });
              recursoEncontrado["persona"] = personaEncontrada[0];

              console.log("recurso encontrado: ",recursoEncontrado);
              //console.log(tipos);
              return of(new HttpResponse({ status: 200, body: recursoEncontrado }));
            }
            // Persona por ID
            if(request.url.match(/\/apimock\/personas\/\d+$/) && request.method === 'GET') {
              let urlParts = request.url.split('/');
              let id = parseInt(urlParts[urlParts.length - 1]);
              let persona = personas.filter(persona => { return persona.id === id; });
              let personaEncontrada = persona.length ? persona[0] : null;

              //console.log(tipos);
              return of(new HttpResponse({ status: 200, body: personaEncontrada }));
            }

            // Dar baja recurso por ID
            if(request.url.match(/\/apimock\/recursos\/baja\/\d+$/) && request.method === 'PUT') {
              let urlParts = request.url.split('/');
              let id = parseInt(urlParts[urlParts.length - 1]);
              let recursoUpdate = request.body;
              let recurso = recursos.filter(recurso => { return recurso.id === id; });
              let recursoEncontrado = recurso.length ? recurso[0] : null;
              let error:boolean = false;

              if(recursoUpdate["fecha_baja"]) {
                recursoEncontrado["fecha_baja"] = recursoUpdate.fecha_baja;
                recursoEncontrado["descripcion_baja"] = recursoUpdate.descripcion_baja;
              }else{
                error = true;
              }

              if (!error) {
                let recursoAgregados = [];
                if (localStorage.getItem('recursos')) {
                  let existe = false;
                  recursoAgregados = [JSON.parse(localStorage.getItem('recursos'))];
                  for (let i = 0; i < recursoAgregados[0].length; i++) {
                    if (recursoAgregados[0][i].id === id){
                      recursoAgregados[0][i] = recursoEncontrado;
                      existe = true;
                    }
                  }
                  if (!existe) {
                    recursoAgregados[0].push(recursoEncontrado);
                  }
                  localStorage.setItem('recursos', JSON.stringify(recursoAgregados[0]));
                }else{
                  recursoAgregados.push(recursoEncontrado);
                  localStorage.setItem('recursos', JSON.stringify(recursoAgregados));
                }
                for (let i = 0; i < recursos.length; i++) {
                  if (recursos[i].id === id) {
                    recursos[i] = recursoEncontrado;
                  }}

                return of(new HttpResponse({ status: 200, body: id }));
              }else{
                /*
                code: 0
                message: "{"fecha_baja":["La fecha de baja no puede ser mayor a la de hoy 2019-03-06"]}"
                name: "Bad Request"
                status: 400
                type: "yii\web\HttpException"
                 */

                return throwError({ error: { message: 'Unauthorised' } });
              }
            }
            // Acreditar recurso por ID
            if(request.url.match(/\/apimock\/recursos\/acreditar\/\d+$/) && request.method === 'PUT') {
              let urlParts = request.url.split('/');
              let id = parseInt(urlParts[urlParts.length - 1]);
              let recursoUpdate = request.body;
              let recurso = recursos.filter(recurso => { return recurso.id === id; });
              let recursoEncontrado = recurso.length ? recurso[0] : null;
              let error:boolean = false;

              if (recursoUpdate["fecha_acreditacion"]) {
                recursoEncontrado["fecha_acreditacion"] = recursoUpdate.fecha_acreditacion;
              }else{
                error = true;
              }

              if (!error) {
                let recursoAgregados = [];
                if (localStorage.getItem('recursos')) {
                  let existe = false;
                  recursoAgregados = [JSON.parse(localStorage.getItem('recursos'))];
                  for (let i = 0; i < recursoAgregados[0].length; i++) {
                    if (recursoAgregados[0][i].id === id){
                      recursoAgregados[0][i] = recursoEncontrado;
                      existe = true;
                    }
                  }
                  if (!existe) {
                    recursoAgregados[0].push(recursoEncontrado);
                  }
                  localStorage.setItem('recursos', JSON.stringify(recursoAgregados[0]));
                }else{
                  recursoAgregados.push(recursoEncontrado);
                  localStorage.setItem('recursos', JSON.stringify(recursoAgregados));
                }
                for (let i = 0; i < recursos.length; i++) {
                  if (recursos[i].id === id) {
                    recursos[i] = recursoEncontrado;
                  }}

                return of(new HttpResponse({ status: 200, body: id }));
              }else{
                return throwError({ error: { message: 'Unauthorised' } });
              }
            }

            // get buscador de recurso social
            if(request.url.endsWith('/apimock/recursos') && request.method === 'GET') {
              // parametros
              let programaid = request.params.get('programaid');
              let pageSize: number = parseInt(request.params.get('pagesize'));
              let localidadid = request.params.get('localidadid');
              let tipo_recursoid = request.params.get('tipo_recursoid');
              let fecha_desde: string = request.params.get('fecha_desde');
              let fecha_hasta: string = request.params.get('fecha_hasta');
              let global_search: string = request.params.get('global_param');
              let page: number = parseInt(request.params.get("page"));
              let acreditacion = request.params.get('acreditacion');
              let baja = request.params.get('baja');
              // variables de uso general
              //let search = (global_search != '') ? global_search.split(" ") : [] ;
              let search = [''];
              if (global_search){
                search = global_search.split(" ");
              }
              let totalPaginas = 0;
              let recursosEncontrados: any[] = [];
              let listaRecursos = {
                total_filtrado: 0,
                pagesize: pageSize,
                pages: totalPaginas,
                estado: true,
                resultado:recursosEncontrados,
                monto_total: 0
              };
              let sumarMonto = 0;
              // esto facilita la busqueda de un recurso con la persona y su dirección
              for (let i = 0; i < recursos.length; i++) {
                recursos[i]["acreditacion"] = (recursos[i]["fecha_acreditacion"]) ? true : false ;
                recursos[i]["baja"] = (recursos[i]["fecha_baja"]) ? true : false ;
                recursos[i]["programa"] = nombrePorId(recursos[i]["programaid"], programas);
                for (let j = 0; j < personas.length; j++) {
                  // preguntar si los id's coinciden
                  if (recursos[i]["personaid"] == personas[j]["id"]){
                    // actualizo las localidades
                    personas[j]["lugar"]["localidad"] = nombrePorId(personas[j]["lugar"]["localidadid"], localidades);
                    // creo a la persona dentro del recurso
                    recursos[i]["persona"] = personas[j];
                  }
                  // pregunto si alumnos existe en el recurso
                  if (recursos[i]["alumnos"] !== undefined){
                    for (let k = 0; k < recursos[i]["alumnos"].length; k++) {
                      for (let l = 0; l < personas.length; l++) {
                        // verifico si el alumno tiene el mismo id que la persona
                        if (recursos[i]["alumnos"][k]["alumnoid"] == personas[l]["id"]) {
                          // actualizo su localidad
                          personas[l]["lugar"]["localidad"] = nombrePorId(personas[l]["lugar"]["localidadid"], localidades);
                          // creo los alumnos
                          recursos[i]["alumnos"][k] = personas[l];
                        }
                      }
                    }
                  }
                }
              }// fin for de recursos

              if (pageSize == 0 && programaid){ // paginacion 0 y un id de programa
                let totalRecursos = parseInt(programaid) * 13;
                recursosEncontrados = recursos.filter(recurso => { return recurso.programaid === parseInt(programaid) });

                // armo array final
                listaRecursos["total_filtrado"] = totalRecursos;
                listaRecursos["pagesize"] = pageSize;
                listaRecursos["resultado"] = recursosEncontrados;

                return of(new HttpResponse({ status: 200, body: listaRecursos }));
              }else{
                recursosEncontrados = recursos.filter(
                  recurso => {
                    for (let i = 0; i < search.length; i++) {
                      let nombre = recurso.persona.nombre.split(" ");
                      for (let j = 0; j < nombre.length; j++) {
                          if ( nombre[j].toLowerCase().indexOf(search[i].toLowerCase()) > -1  ) {
                            return recurso;
                          }
                      }
                      if (recurso.persona.nro_documento.toLowerCase().indexOf(search[i].toLowerCase()) > -1 ){
                        return recurso;
                      }
                      if ( recurso.persona.apellido.toLowerCase().indexOf(search[i].toLowerCase()) > -1 ) {
                        return recurso;
                      }
                    }
                  });
                  if (localidadid) {
                    recursosEncontrados = recursosEncontrados.filter(recurso => { return parseInt(localidadid) === parseInt(recurso.persona.lugar.localidadid); });
                  }
                  if (programaid) {
                    recursosEncontrados = recursosEncontrados.filter(recurso => { return parseInt(programaid) === parseInt(recurso.programaid); });
                  }
                  if (tipo_recursoid) {
                    recursosEncontrados = recursosEncontrados.filter(recurso => { return parseInt(tipo_recursoid) === parseInt(recurso.tipo_recursoid); });
                  }
                  if (acreditacion) {
                    recursosEncontrados = recursosEncontrados.filter(recurso => { return recurso.fecha_acreditacion != undefined; });
                  }
                  if (baja) {
                    recursosEncontrados = recursosEncontrados.filter(recurso => { return recurso.fecha_baja != undefined; });
                  }
                  // sumo los montos filtrados
                  for (let i = 0; i < recursosEncontrados.length; i++) {
                    sumarMonto = recursosEncontrados[i]["monto"] + sumarMonto;
                  }
                  //console.log(recursosEncontrados);
                  let totalFiltrado:number = recursosEncontrados.length;
                  let total:number = totalFiltrado/pageSize;
                  let numEntero = Math.floor(total);
                  let totalPagina:number = (total > numEntero) ? numEntero + 1 : total;

                  listaRecursos.total_filtrado = recursosEncontrados.length;
                  listaRecursos.pages = totalPagina;
                  listaRecursos.monto_total = sumarMonto;
                  if (page > 0) {
                    page = page;
                    let pageStart = page * pageSize;
                    let pageEnd = pageStart + pageSize;
                    listaRecursos.resultado = recursosEncontrados.slice(pageStart, pageEnd);
                  }else{
                    listaRecursos.resultado = recursosEncontrados.slice(0,pageSize);
                  }



                return of(new HttpResponse({ status: 200, body: listaRecursos }));
              }
                //console.log(tipos);
            }
            //Guardado de recurso
            if(request.url.endsWith('/apimock/recursos') && request.method === 'POST') {
              let nuevoRecurso = request.body;
              // validation
              let duplicateRecurso = recursos.filter(recurso => { return recurso.id === nuevoRecurso.id; }).length;
              if (duplicateRecurso) {
                  return throwError({ error: { message: 'Esta persona ya existe!' } });
              }
              let recursoid = recursos.length + 1;

              nuevoRecurso["id"] = recursoid;
              nuevoRecurso["fecha_inicial"] = hoy();
              nuevoRecurso["tipo_recurso"] = nombrePorId(nuevoRecurso.tipo_recursoid, tipoRecurso);
              nuevoRecurso["programa"] = nombrePorId(nuevoRecurso.programaid, programas);

              delete nuevoRecurso["fechaAlta"];

              //personas.push(nuevaPersona);
              let recursosAgregados = [];
              if (localStorage.getItem('recursos')) {
                recursosAgregados = [JSON.parse(localStorage.getItem('recursos'))];
                recursosAgregados[0].push(nuevoRecurso);
                localStorage.setItem('recursos', JSON.stringify(recursosAgregados[0]));
              }else{
                recursosAgregados.push(nuevoRecurso);
                localStorage.setItem('recursos', JSON.stringify(recursosAgregados));
              }
              recursos.push(nuevoRecurso);

              return of(new HttpResponse({ status: 200, body: {data:{id:recursoid}} }));
            }
            // get Buscador de personas
            if(request.url.endsWith('/apimock/personas') && request.method === 'GET') {
              let globalSearch = request.params.get('global_param');
              let pageSize:number = parseInt(request.params.get('pagesize'));
              let page = parseInt(request.params.get('page'));
              let search = globalSearch.split(" ");
              let resultado = [];
              let listaPersonas = {
                total_filtrado: 0,
                pagesize: pageSize,
                pages: 0,
                estado: true,
                resultado:[]
              };
              resultado = personas.filter(
                persona => {
                  for (let i = 0; i < search.length; i++) {
                    let nombre = persona.nombre.split(" ");
                    for (let j = 0; j < nombre.length; j++) {
                        if ( nombre[j].toLowerCase().indexOf(search[i].toLowerCase()) > -1  ) {
                          return persona;
                        }
                    }
                    if (persona.nro_documento.toLowerCase().indexOf(search[i].toLowerCase()) > -1 ){
                      return persona;
                    }
                    if ( persona.apellido.toLowerCase().indexOf(search[i].toLowerCase()) > -1 ) {
                      return persona;
                    }
                    if ( persona.lugar.calle.toLowerCase().indexOf(search[i].toLowerCase()) > -1  ) {
                      return persona;
                    }
                  }
                });
                let totalFiltrado:number = resultado.length;
                let total:number = totalFiltrado/pageSize;
                let numEntero = Math.floor(total);
                let totalPagina:number = (total > numEntero) ? numEntero + 1 : total;

                listaPersonas.total_filtrado = resultado.length;
                listaPersonas.pages = totalPagina;
                if (page > 0) {
                  page = page;
                  let pageStart = page * pageSize;
                  let pageEnd = pageStart + pageSize;
                  listaPersonas.resultado = resultado.slice(pageStart, pageEnd);
                }else{
                  listaPersonas.resultado = resultado.slice(0,pageSize);
                }

              return of(new HttpResponse({ status: 200, body: listaPersonas }));

            }
            // guardar persona
            if (request.url.endsWith('/apimock/personas') && request.method === 'POST') {
              // get new user object from post body
              let nuevaPersona = request.body;

              // validation
              let duplicateUser = personas.filter(persona => { return persona.nro_documento === nuevaPersona.nro_documento; }).length;
              if (duplicateUser) {
                  return throwError({ error: { message: 'Esta persona ya existe!' } });
              }

              // save new user
              let id = personas.length + 1;
              nuevaPersona.id = id;
              nuevaPersona.sexo = nombrePorId(nuevaPersona.sexoid, sexos);
              nuevaPersona.genero = nombrePorId(nuevaPersona.generoid, generos);
              nuevaPersona.estado_civil = nombrePorId(nuevaPersona.estado_civilid, estadoCivil);
              nuevaPersona.lugar.localidad = nombrePorId(nuevaPersona.lugar.localidadid, localidades);

              //personas.push(nuevaPersona);
              let personasAgregadas = [];
              if (localStorage.getItem('personas')) {
                personasAgregadas = [JSON.parse(localStorage.getItem('personas'))];
                personasAgregadas[0].push(nuevaPersona);
                localStorage.setItem('personas', JSON.stringify(personasAgregadas[0]));
              }else{
                personasAgregadas.push(nuevaPersona);
                localStorage.setItem('personas', JSON.stringify(personasAgregadas));
              }
              personas.push(nuevaPersona);
              // respond 200 OK
              return of(new HttpResponse({ status: 200, body: {data:{id: id}} }));
            }
            // Actualizacion de una persona
            if (request.url.match(/\/apimock\/personas\/\d+$/) && request.method === 'PUT') {
              // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
              //if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                  // find user by id in users array
                  let urlParts = request.url.split('/');
                  let personaid = parseInt(urlParts[urlParts.length - 1]);
                  let datosPersona = request.body;

                  let persona = personas.filter(persona => { return persona.id === personaid; });
                  let personaEncontrada = persona.length ? persona[0] : null;

                  if (personaEncontrada["contacto"] !== undefined) {
                    delete personaEncontrada["contacto"];
                  }
                  if (personaEncontrada["hogar"] !== undefined) {
                    delete personaEncontrada["hogar"];
                  }
                  if (personaEncontrada["estudios"] !== undefined) {
                    delete personaEncontrada["estudios"];
                  }
                  if (datosPersona.apellido !== undefined){
                    personaEncontrada["apellido"]             = datosPersona.apellido;
                    personaEncontrada["celular"]              = datosPersona.celular;
                    personaEncontrada["cuil"]                 = datosPersona.cuil;
                    personaEncontrada["email"]                = datosPersona.email;
                    personaEncontrada["estado_civil"]         = nombrePorId(datosPersona.estado_civilid, estadoCivil);
                    personaEncontrada["estado_civilid"]       = datosPersona.estado_civilid;
                    personaEncontrada["fecha_nacimiento"]     = datosPersona.fecha_nacimiento;
                    personaEncontrada["genero"]               = nombrePorId(datosPersona.generoid, generos);
                    personaEncontrada["generoid"]             = datosPersona.generoid;
                    personaEncontrada["id"]                   = datosPersona.id;
                    personaEncontrada["nombre"]               = datosPersona.nombre;
                    personaEncontrada["nro_documento"]        = datosPersona.nro_documento;
                    personaEncontrada["red_social"]           = datosPersona.red_social;
                    personaEncontrada["sexo"]                 = nombrePorId(datosPersona.sexoid, sexos);
                    personaEncontrada["sexoid"]               = datosPersona.sexoid;
                    personaEncontrada["telefono"]             = datosPersona.telefono;
                    personaEncontrada["lugar"]["altura"]      = datosPersona.lugar.altura;
                    personaEncontrada["lugar"]["barrio"]      = datosPersona.lugar.barrio;
                    personaEncontrada["lugar"]["calle"]       = datosPersona.lugar.calle;
                    personaEncontrada["lugar"]["depto"]       = datosPersona.lugar.depto;
                    personaEncontrada["lugar"]["escalera"]    = datosPersona.lugar.escalera;
                    personaEncontrada["lugar"]["id"]          = datosPersona.lugar.id;
                    personaEncontrada["lugar"]["localidad"]   = nombrePorId(datosPersona.lugar.localidadid, localidades);
                    personaEncontrada["lugar"]["localidadid"] = datosPersona.lugar.localidadid;
                    personaEncontrada["lugar"]["piso"]        = datosPersona.lugar.piso;
                  }else{
                    personaEncontrada["celular"]              = datosPersona.celular;
                    personaEncontrada["red_social"]           = datosPersona.red_social;
                    personaEncontrada["telefono"]             = datosPersona.telefono;
                    personaEncontrada["email"]                = datosPersona.email;
                  }

                  let personasAgregadas = [];
                  if (localStorage.getItem('personas')) {
                    let existe = false;
                    personasAgregadas = [JSON.parse(localStorage.getItem('personas'))];
                    for (let i = 0; i < personasAgregadas[0].length; i++) {
                      if (personasAgregadas[0][i].id === personaid){
                        personasAgregadas[0][i] = personaEncontrada;
                        existe = true;
                      }
                    }
                    if (!existe) {
                      personasAgregadas[0].push(personaEncontrada);
                    }
                    localStorage.setItem('personas', JSON.stringify(personasAgregadas[0]));
                  }else{
                    personasAgregadas.push(personaEncontrada);
                    localStorage.setItem('personas', JSON.stringify(personasAgregadas));
                  }
                  for (let i = 0; i < personas.length; i++) {
                    if (personas[i].id === personaid) {
                      personas[i] = personaEncontrada;
                    }}

                  return of(new HttpResponse({ status: 200, body: {id:personaid} }));
              /* } else {
                  // return 401 not authorised if token is null or invalid
                  return throwError({ error: { message: 'Unauthorised' } });
              } */
          }

          // Actualizacion de contactos de una persona
          if (request.url.match(/\/apimock\/personas\/contacto\/\d+$/) && request.method === 'PUT') {
            // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
            //if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                // find user by id in users array
                let urlParts = request.url.split('/');
                let personaid = parseInt(urlParts[urlParts.length - 1]);
                let datosPersona = request.body;

                let persona = personas.filter(persona => { return persona.id === personaid; });
                let personaEncontrada = persona.length ? persona[0] : null;

                if (personaEncontrada["contacto"] !== undefined) {
                  delete personaEncontrada["contacto"];
                }
                if (personaEncontrada["hogar"] !== undefined) {
                  delete personaEncontrada["hogar"];
                }
                if (personaEncontrada["estudios"] !== undefined) {
                  delete personaEncontrada["estudios"];
                }

                /* ACTUALIZO DATOS DE CONTACTOS DE UNA PERSONA */
                personaEncontrada["celular"]    = datosPersona.celular;
                personaEncontrada["red_social"] = datosPersona.red_social;
                personaEncontrada["telefono"]   = datosPersona.telefono;
                personaEncontrada["email"]      = datosPersona.email;

                let personasAgregadas = [];
                if (localStorage.getItem('personas')) {
                  let existe = false;
                  personasAgregadas = [JSON.parse(localStorage.getItem('personas'))];
                  for (let i = 0; i < personasAgregadas[0].length; i++) {
                    if (personasAgregadas[0][i].id === personaid){
                      personasAgregadas[0][i] = personaEncontrada;
                      existe = true;
                    }
                  }
                  if (!existe) {
                    personasAgregadas[0].push(personaEncontrada);
                  }
                  localStorage.setItem('personas', JSON.stringify(personasAgregadas[0]));
                }else{
                  personasAgregadas.push(personaEncontrada);
                  localStorage.setItem('personas', JSON.stringify(personasAgregadas));
                }
                for (let i = 0; i < personas.length; i++) {
                  if (personas[i].id === personaid) {
                    personas[i] = personaEncontrada;
                  }}

                return of(new HttpResponse({ status: 200, body: {data:{id:personaid}} }));
            /* } else {
                // return 401 not authorised if token is null or invalid
                return throwError({ error: { message: 'Unauthorised' } });
            } */
        }

        // get beneficiarios
        if (request.url.endsWith('/apimock/beneficiarios') && request.method === 'GET') {
          //if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
            let pageSize: number = parseInt(request.params.get('pagesize'));
            let page: number = parseInt(request.params.get("page"));
            let localidadid = request.params.get('localidadid');
            let global_search = request.params.get('global_param');
            let search = [''];
            if(global_search) {
              search = global_search.split(" ");
            }

            let filtroBeneficiario = {
              "success": true,
              "pagesize": pageSize,
              "pages": 0,
              "total_filtrado": 0,
              "resultado": []
            };
            var hash = {};
            let cantPersonas = recursos.filter(recurso => {
              var exists = !hash[parseInt(recurso.personaid)] || false;
              hash[parseInt(recurso.personaid)] = true;
              return exists;
            });

            const beneficiarios: any = [];
            // obtengo todos los datos de los beneficiarios
            for (let i = 0; i < cantPersonas.length; i++) {
              // filtro la cantidad de recursos que tiene una persona
              let cantRecursos = recursos.filter(recurso => { return cantPersonas[i].personaid == recurso.personaid; });
              // busco los datos de la persona
              let persona = personas.filter(persona => { return persona.id === cantPersonas[i].personaid; });
              // sumo los montos de los recursos de una persona
              let montoTotal = cantRecursos.map(recurso => {
                  return recurso.monto;
              });
              let montoTotalAcreditado = cantRecursos.map(recurso => {
                return (recurso.fecha_acreditacion != undefined) ? recurso.monto : 0;
              });
              let cantRecursosAcreditado = cantRecursos.filter(recurso => {
                return recurso.fecha_acreditacion != undefined;
              });
              // armo el array de los beneficiarios
              beneficiarios.push({
                "personaid": cantPersonas[i].personaid,
                "recurso_cantidad": cantRecursos.length,
                "recurso_acreditado_cantidad": cantRecursosAcreditado.length,
                "persona": persona[0],
                "monto": (montoTotal.length != 0) ? sum(montoTotal) : 0,
                "monto_acreditado": (montoTotalAcreditado.length != 0) ? sum(montoTotalAcreditado) : 0
              });
            }

            // aplico la busqueda para el array de beneficiario
            let beneficiariosEncontrados = beneficiarios.filter(
              beneficiario => {
                for (let i = 0; i < search.length; i++) {
                  let nombre = beneficiario.persona.nombre.split(" ");
                  for (let j = 0; j < nombre.length; j++) {
                      if ( nombre[j].toLowerCase().indexOf(search[i].toLowerCase()) > -1  ) {
                        return beneficiario;
                      }
                  }
                  if (beneficiario.persona.nro_documento.toLowerCase().indexOf(search[i].toLowerCase()) > -1 ){
                    return beneficiario;
                  }
                  if ( beneficiario.persona.apellido.toLowerCase().indexOf(search[i].toLowerCase()) > -1 ) {
                    return beneficiario;
                  }
                }
              });
              if (localidadid) {
                beneficiariosEncontrados = beneficiariosEncontrados.filter(recurso => { return parseInt(localidadid) === parseInt(recurso.persona.lugar.localidadid); });
              }

              console.log(beneficiariosEncontrados);

            // despues de la busqueda
            let totalFiltrado: number = beneficiarios.length;
            let total:number = totalFiltrado/pageSize;
            let numEntero = Math.floor(total);
            let totalPagina:number = (total > numEntero) ? numEntero + 1 : total;

            filtroBeneficiario.total_filtrado = beneficiarios.length;
            filtroBeneficiario.pages = totalPagina;
            filtroBeneficiario.resultado = beneficiarios;

            if (page > 0) {
              page = page;
              let pageStart = page * pageSize;
              let pageEnd = pageStart + pageSize;
              filtroBeneficiario.resultado = beneficiarios.slice(pageStart, pageEnd);
            }else{
              filtroBeneficiario.resultado = beneficiarios.slice(0,pageSize);
            }

            return of(new HttpResponse({ status: 200, body: filtroBeneficiario }));
          //} else {
              // return 401 not authorised if token is null or invalid
          //     return throwError({ error: { message: 'Unauthorised' } });
          // }
        }

            /* ----------------------  LISTAS GENERALES  --------------------------- */
            // get TIPO RECURSO SOCIAL por programa id
            if(request.url.endsWith('/apimock/tipo-recursos') && request.method === 'GET') {
              let programaid = request.params.get('programaid');
              let tipos = tipoRecurso.filter(recurso => { return recurso.programaid === parseInt(programaid) });
              return of(new HttpResponse({ status: 200, body: tipos }));

            }
            // get sexos
            if (request.url.endsWith('/apimock/sexos') && request.method === 'GET') {
              //if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                  return of(new HttpResponse({ status: 200, body: sexos }));
              //} else {
                  // return 401 not authorised if token is null or invalid
              //     return throwError({ error: { message: 'Unauthorised' } });
              // }
            }
            // get localidades
            if (request.url.endsWith('/apimock/localidads') && request.method === 'GET') {
              //if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                  return of(new HttpResponse({ status: 200, body: localidades }));
              //} else {
                  // return 401 not authorised if token is null or invalid
              //     return throwError({ error: { message: 'Unauthorised' } });
              // }
            }
            // get estado civil
            if (request.url.endsWith('/apimock/estado-civils') && request.method === 'GET') {
              //if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                  return of(new HttpResponse({ status: 200, body: estadoCivil }));
              //} else {
                  // return 401 not authorised if token is null or invalid
              //     return throwError({ error: { message: 'Unauthorised' } });
              // }
            }
            // get genero
            if (request.url.endsWith('/apimock/generos') && request.method === 'GET') {
              //if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                  return of(new HttpResponse({ status: 200, body: generos }));
              //} else {
                  // return 401 not authorised if token is null or invalid
              //     return throwError({ error: { message: 'Unauthorised' } });
              // }
            }
            // get PROGRAMAS
            if (request.url.endsWith('/apimock/programas') && request.method === 'GET') {
              // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
              //if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                for (let i = 0; i < programas.length; i++) {
                  // obtengo cantidad de los recursos por programa
                  let recursoPrograma = recursos.filter(recurso => { return parseInt(recurso.programaid) === parseInt(programas[i].id); });
                  programas[i]["recurso_cantidad"] = recursoPrograma.length;
                  // sumo los monto de cada programa
                  let montoTotalPrograma = recursoPrograma.map(recurso => {
                    return recurso.monto;
                  });
                  programas[i]["monto"] = (montoTotalPrograma.length != 0) ? sum(montoTotalPrograma) : 0 ;
                  // cuento las pesona por programa
                  var hash = {};
                  let cantPersonas = recursoPrograma.filter(recurso => {
                    var exists = !hash[parseInt(recurso.personaid)] || false;
                    hash[parseInt(recurso.personaid)] = true;
                    return exists;
                  });
                  programas[i]["persona_cantidad"] = cantPersonas.length;
                }
                  return of(new HttpResponse({ status: 200, body: programas }));
              //} else {
                  // return 401 not authorised if token is null or invalid
              //     return throwError({ error: { message: 'Unauthorised' } });
              // }
            }
            // get PROGRAMAS por id /\/users\/\d+$/
            if (request.url.match(/\/apimock\/programas\/\d+$/) && request.method === 'GET') {
              // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
              //if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                let urlParts = request.url.split('/');
                let id = parseInt(urlParts[urlParts.length - 1]);
                let programaElegido = programas.filter(programa => { return programa.id === id });
                  return of(new HttpResponse({ status: 200, body: programaElegido[0] }));
              //} else {
                  // return 401 not authorised if token is null or invalid
              //     return throwError({ error: { message: 'Unauthorised' } });
              // }
            }
            // pass through any requests not handled above
            return next.handle(request);

        }))

        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(1500))
        .pipe(dematerialize());
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
