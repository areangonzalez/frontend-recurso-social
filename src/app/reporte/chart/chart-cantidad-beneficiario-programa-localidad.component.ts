import { ComponentRef } from '@angular/core';
import { Component, ChangeDetectorRef, AfterViewInit, AfterViewChecked} from '@angular/core';
import { Chart } from 'chart.js';
import { MensajesService, EstadisticaService } from 'src/app/core/services';
import { finalize } from 'rxjs/operators';

export interface myinterface {
    remove(index: number);
}

@Component({
  selector: 'reporte-cantidad-beneficiario-programa-localidad',
  templateUrl: './chart-cantidad-beneficiario-programa-localidad.component.html',
})
export class ChartBeneficiarioProgramaLocalidadComponent implements AfterViewInit {

  public index: number;
  public selfRef: ChartBeneficiarioProgramaLocalidadComponent;
  //interface for Parent-Child interaction
  public compInteraction: myinterface;
  public idCanvas: string;
  public chart:any;
  public colorsGrafico: any[] = [];
  public datosPrograma: any[] = [];
  public localidadId:number = 0;
  public localidadNombre: string = '';
  public isComplete: boolean = false;

  constructor(
    private _mensajeService: MensajesService,
    private _estadisticaService: EstadisticaService,
    private _cdRef: ChangeDetectorRef
  ){}

  ngAfterViewInit() {
    this.mostrarGrafico();
    this.obtenerDatosPrograma();
  }

  ngAfterViewChecked() {
    this.chart.canvas.parentNode.style.height = '160px';
    this._cdRef.detectChanges();
  }

  private obtenerDatosPrograma(){
    if (this.localidadId != 0){

      this._estadisticaService.programasPorLocalidad(this.localidadId)
      .pipe(
        finalize(() => this.isComplete = true )
      )
      .subscribe(datos => {
        if (datos.length > 0) {
          datos.forEach((val, i) => {
            // nombre de programas
            this.chart.data.labels.push(datos[i].nombre);
            // cantidad de beneficiarios
            this.chart.data.datasets[0].data.push(datos[i].beneficiario_cantidad);
            // agrego colores al grafico
            this.chart.data.datasets[0].backgroundColor.push(datos[i].color);
            // creo lista de colores
            this.colorsGrafico.push({color: datos[i].color, nombre: datos[i].nombre});
            // agrego las opciones al grafico
            this.chart.options = this.pieOptions;
            // actualizo el grafico
            this.chart.update();
          });
        }else{
          this.compInteraction.remove(this.index);
          this._mensajeService.cancelado("No se han encontrado resultados.", [{name:''}]);
        }
      }, error => { this._mensajeService.cancelado(error, [{name:''}]); });
    }else{
      this._mensajeService.cancelado("Error, no se ha seleccionado ninguna localidad", [{name:''}]);
    }
  }

  private mostrarGrafico(){
    this.chart = new Chart(this.idCanvas, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Beneficiarios',
            data: [],
            backgroundColor: [],
          }
        ]
      }
    });
  }

  /* private colorPrograma(nombrePrograma:string) {
    for (let i = 0; i < this.colorsGrafico.length; i++) {
      if (this.colorsGrafico[i].nombre == nombrePrograma) {
        return this.colorsGrafico[i].color;
      }
    }
  } */

  removeMe(index) {
    this.compInteraction.remove(index)
  }

  public pieOptions = {
    events: false,
    legend: { display: false },
    animation: {
      duration: 500,
      easing: "easeOutQuart",
      onProgress: function () {
        var ctx = this.chart.ctx;
        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        this.data.datasets.forEach(function (dataset) {

          for (var i = 0; i < dataset.data.length; i++) {
            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
                start_angle = model.startAngle,
                end_angle = model.endAngle,
                mid_angle = start_angle + (end_angle - start_angle)/2;

            var x = mid_radius * Math.cos(mid_angle);
            var y = mid_radius * Math.sin(mid_angle);

            ctx.fillStyle = '#000';
            ctx.fillText(dataset.data[i], model.x + x, model.y + y - 5);
          }
        });
      }
    }
  };

}
