import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../core/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public logueado: boolean = false;
  public huboError: boolean = false;
  public mensaje: string = "";
  public returnUrl: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _auth: AuthenticationService,
    private _fb: FormBuilder
  ){
    this.loginForm = _fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    // redirijo a la pagina principal si esta logueado
    this.isLogin();
  }


  ngOnInit() {
    // guardo la ultima ruta a la que se a querido acceder
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/inicio';
  }

  public ingresar() {

    this._auth.login(this.loginForm.value)
            .pipe(first())
            .subscribe(
            user => {
                this.redirigirUsuario(user.rol);
            },
            error => {
              this.huboError = true;
              this.mensaje = "Por favor verifique sus datos.";
            });
  }

  private isLogin(){
    if (this._auth.loggedIn) {
       this.redirigirUsuario(this._auth.loggedIn.rol);
    }
  }

  redirigirUsuario(userRol: string) {
    if (userRol === 'soporte') {
      this.router.navigateByUrl('/admin');
    } else {
      this.router.navigate(['/inicio']);
    }
  }
}
