import { Injectable } from "@angular/core";
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';

@Injectable()
export class BeneficiarioService {

  constructor(
    private _apiService: ApiService
  ){}

  listar() {
    return this._apiService.get('/beneficiarios');
  }

}
