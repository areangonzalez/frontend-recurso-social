import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { ApiService } from './api.service';

@Injectable()
export class RecursoSocialService implements Resolve<any> {

  constructor(
    private _apiService: ApiService
  ){}

  listar() {
    return this._apiService.get('/recursos');
  }

  public buscar(params:object) {
    let httpParams = new HttpParams();
    httpParams = this._apiService.formatParams(httpParams, params);

    return this._apiService.get('/recursos',httpParams);
  }

  public guardar(params:object, id:number) {
    if (id !== 0) {
      //return this._apiService.put('/recursos/' + id, params);
    }else{
      return this._apiService.post('/recursos',params);
    }
  }

  public recursoPorId(id:number) {
    return this._apiService.get('/recursos/' + id);
  }

  public acreditar(params:object, id:number) {
    return this._apiService.put('/recursos/acreditar/' + id, params);
  }

  public baja(params:object, id:number) {
    return this._apiService.put('/recursos/baja/' + id, params);
  }

  public bajaAlumno(params:object) {
    return this._apiService.put('/recursos/baja-alumno', params);
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    ): Observable<any>|Promise<any>|any {
      let httpParams = new HttpParams();
      httpParams = this._apiService.formatParams(httpParams, { pagesize: 20, pages: 0, sort: "-fecha_alta" });
      return this._apiService.get('/recursos', httpParams);
    }

}
