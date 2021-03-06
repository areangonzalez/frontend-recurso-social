import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TitleService, AuthenticationService, LoaderService } from './../../core/services';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.sass']
})
export class AdminLayoutComponent implements OnInit {
  public isCollapsed = true;
  public mostrar: boolean = false;
  public nombreUsuario: string = "";

  constructor(
    private _router: Router,
    private _titleService: TitleService,
    private _auth: AuthenticationService,
    private _loaderService: LoaderService
  ) { }

  ngOnInit() {
    this._titleService.init();
    this.setNombreUsuario();
  }

  estoyLogueado(){
    return true;
  }

  cerrarSesion(){
    this._loaderService.show();
    setTimeout(() => {
      this._auth.logout();
      this._loaderService.hide();
      this._router.navigate(['/login']);
      }, 1000);
  }

  mostrarMenu(){
    this.mostrar = !this.mostrar;
  }

  ocultarMenu(){
    this.mostrar = false;
  }

  setNombreUsuario() {
    if (this._auth.loggedIn.apellido && this._auth.loggedIn.nombre && this._auth.loggedIn.rol !== 'admin') {
      this.nombreUsuario = this._auth.loggedIn.apellido + ", " + this._auth.loggedIn.nombre;
    }else{
      this.nombreUsuario = "Admin";
    }
  }

}
