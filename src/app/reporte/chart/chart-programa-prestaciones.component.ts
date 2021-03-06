import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { MensajesService, DetalleProgramaService } from 'src/app/core/services';

@Component({
  selector: 'reporte-programa-prestaciones',
  templateUrl: './chart-programa-prestaciones.component.html'
})
export class ChartProgramaPrestacionesComponent implements OnInit {

  public chart:any;
  public colorsGrafico: any[] = [];
  public datosPrograma: any[] = [];

  constructor(
    private _mensajeService: MensajesService,
    private _detalleProgramaService: DetalleProgramaService
  ){

  }

  ngOnInit() {
    this.mostrarGrafico();
    this.obtenerDatosPrograma();
  }

  private obtenerDatosPrograma(){
    this._detalleProgramaService.info()
    .subscribe(programa => {
      programa.forEach((val, i) => {
        this.datosPrograma.push({ nombre: programa[i].nombre, color: programa[i].color, recurso_cantidad: programa[i].recurso_cantidad });
        // hago el listado de colores para mostrar en el grafico
        this.colorsGrafico.push(programa[i].color);
        // nombre de programas
        this.chart.data.labels.push(programa[i].nombre);
        // cantidad recursos
        this.chart.data.datasets[0].data.push(programa[i].recurso_cantidad);
        this.chart.update();
      });
    }, error => { this._mensajeService.cancelado(error, [{name:''}]); });
  }

  private mostrarGrafico(){
    this.chart = new Chart('programa-prestaciones', {
      type: 'pie',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Prestaciones',
            data: [],
            backgroundColor: this.colorsGrafico,
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: false
        }
      }
    });
  }
}
