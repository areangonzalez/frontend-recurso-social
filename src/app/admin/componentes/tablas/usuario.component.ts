import { Component, OnInit } from '@angular/core';
import { ModalConfig, BotonDisenio } from './../../../core/models';

@Component({
  selector: 'admin-usuario-tabla',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.sass']
})
export class UsuarioComponent implements OnInit {
  /* Configuraciones para el modal de agregar y editar usuario */
  public configModalAgregar: ModalConfig = { title: "Agregar usuario" };
  public configBotonModalAgregar: BotonDisenio = { class: 'btn btn-sm btn-success btn-block', iconoClass: 'fas fa-user-plus', text:'Agregar Usuario' };
  public configModalEditar: ModalConfig = { title: "Editar usuario" };
  public configBotonModalEditar: BotonDisenio = { class: 'btn btn-sm btn-outline-secondary rounded-circle', iconoClass: 'fas fa-user-edit', text:'' };

  public page = 1;



  constructor() { }

  ngOnInit() {
  }

}