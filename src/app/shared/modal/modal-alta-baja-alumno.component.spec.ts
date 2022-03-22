import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAltaBajaAlumnoComponent } from './modal-alta-baja-alumno.component';

describe('ModalAltaBajaAlumnoComponent', () => {
  let component: ModalAltaBajaAlumnoComponent;
  let fixture: ComponentFixture<ModalAltaBajaAlumnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAltaBajaAlumnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAltaBajaAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
