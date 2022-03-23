import { Component, OnInit } from '@angular/core';
import { Router, RouterLinkActive } from '@angular/router';
import { AuthenticationService } from "../../core/services";
import { LoaderService } from "../../core/services";

@Component({
    selector: 'layout-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
    public isCollapsed = true;
    public mostrar: boolean = false;
    public nombreUsuario: string = "";

    constructor(
        private _router: Router,
        private _authentication: AuthenticationService,
        private _loaderService: LoaderService
    ) { }

    ngOnInit() {
      this.setNombreUsuario();
    }

    estoyLogueado(){
      return true;
    }

    cerrarSesion(){
      this._loaderService.show();
      setTimeout(() => {
        this._authentication.logout();
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

    mostrarModuloAlimentar() {
      let mostrar = false;
      if (this._authentication.loggedIn !== null && this._authentication.loggedIn.programaids !== undefined) {
        let programaids = this._authentication.loggedIn.programaids;
        for (let i = 0; i < programaids.length; i++) {
          if (programaids[i] === 6) {
            mostrar = true;
          }
        }
      }
      return mostrar;
    }

    setNombreUsuario() {
      if (this._authentication.loggedIn.apellido && this._authentication.loggedIn.nombre && this._authentication.loggedIn.rol !== 'admin') {
        this.nombreUsuario = this._authentication.loggedIn.apellido + ", " + this._authentication.loggedIn.nombre;
      }else{
        this.nombreUsuario = "Admin";
      }
    }

    esAdmin() {
      return (this._authentication.loggedIn && this._authentication.loggedIn.rol !== 'admin') ? false : true;
    }

}
