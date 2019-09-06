import { by, browser, element } from "protractor";
import { AppCabeceraPage } from "./page-object/app.cabecera-po";
import { AppLoginPage } from "./page-object/app.login-po";

describe('busqueda avanzada',  () => {
  let login: AppLoginPage;
  let cabecera: AppCabeceraPage;
  // Inicio de session para realizar tareas de testing
  beforeAll(() => {
    login = new AppLoginPage();

    browser.get('/login');
    // Agrego un usuario valido
    login.nombreUsuario().sendKeys("admin");
    login.passUsuario().sendKeys("admins");

    let btnLogin = login.loginComp().element(by.id('ingresar-login'));

    btnLogin.click();

    browser.waitForAngular();
  });

  it('Abro la busqueda avanzada', () => {
    browser.get('/inicio/reporte/prestaciones');
    browser.waitForAngular();
    // componente de busqueda
    let buscarRecursoComp = element(by.tagName('busqueda-recurso'));
    // cliqueo el boton de busqueda avanzada
    buscarRecursoComp.element(by.css('button.btn-md.btn-primary')).click();
  });

  it('Busco por cipolletti', () => {
    // componente de busqueda
    let buscarRecursoComp = element(by.tagName('busqueda-recurso'));
    // componente de listado de recursos
    let listaRecursoComp = element(by.tagName('lista-recurso'));
    // ingreso la localidad
    buscarRecursoComp.element(by.id('localidad')).element(by.cssContainingText('option', 'Cipolletti')).click();
    // cliqueo el boton buscar
    buscarRecursoComp.element(by.css('button.btn-primary')).click();
    // espero el resultado
    browser.waitForAngular();
    // vefrifico el resultado
    listaRecursoComp.element(by.tagName('table tbody')).all(by.tagName('tr')).then(function(resultado) {
      // muestro la cantidad encontrada
      expect(resultado.length).toBe(7);
    });
  });

  it('Busco por General Roca', () => {
    // componente de busqueda
    let buscarRecursoComp = element(by.tagName('busqueda-recurso'));
    // componente de listado de recursos
    let listaRecursoComp = element(by.tagName('lista-recurso'));
    // ingreso la localidad
    buscarRecursoComp.element(by.id('localidad')).element(by.cssContainingText('option', 'General Roca')).click();
    // cliqueo el boton buscar
    buscarRecursoComp.element(by.css('button.btn-primary')).click();
    // espero el resultado
    browser.waitForAngular();
    // vefrifico el resultado
    listaRecursoComp.element(by.tagName('table tbody')).all(by.tagName('tr')).then(function(resultado) {
      // muestro la cantidad encontrada y vefrifico el resultado
      expect(resultado.length).toBe(6);
    });
  });

  it('Busco por Viedma', () => {
    // componente de busqueda
    let buscarRecursoComp = element(by.tagName('busqueda-recurso'));
    // componente de listado de recursos
    let listaRecursoComp = element(by.tagName('lista-recurso'));
    // ingreso la localidad
    buscarRecursoComp.element(by.id('localidad')).element(by.cssContainingText('option', 'Viedma')).click();
    // cliqueo el boton buscar
    buscarRecursoComp.element(by.css('button.btn-primary')).click();
    // espero el resultado
    browser.waitForAngular();
    // vefrifico el resultado
    listaRecursoComp.element(by.tagName('table tbody')).all(by.tagName('tr')).then(function(resultado) {
      // muestro la cantidad encontrada y vefrifico el resultado
      expect(resultado.length).toBe(4);
    });
  });

  // Cierro la session una vez terminadas las tareas de testing
  afterAll(() => {
    let cabecera = new AppCabeceraPage();

    cabecera.abrirMenu().click()
    browser.waitForAngular();
    cabecera.cerrarSesion().click();
    browser.waitForAngular();
  });

});
