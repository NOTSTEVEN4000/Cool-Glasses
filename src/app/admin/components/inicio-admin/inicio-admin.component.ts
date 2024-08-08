import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConexProductosService, Producto } from '../../../core/services/producto/product.service';
import { Subscription } from 'rxjs';
import { Resena } from '../../../core/models/resena.interface';
import { ResenaService } from '../../../core/services/resenas/resenas.service';
import { ConexionusuarioService, Usuario } from '../../../core/services/usuario/conexionusuario.service';
import { ComprobanteDetalleVentaModels, ComprobanteService } from '../../../core/services/comprobante/comprobante.service';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import jsPDF from 'jspdf';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FormControl, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
Chart.register(ChartDataLabels);
Chart.register(...registerables);
type ProductoField = keyof Producto;

@Component({
  selector: 'app-inicio-admin',
  standalone: true,
  providers: [provideCharts(withDefaultRegisterables())],
  imports: [BaseChartDirective, CommonModule, FormsModule],
  templateUrl: './inicio-admin.component.html',
  styleUrl: './inicio-admin.component.css'
})
export class InicioAdminComponent implements OnInit, OnDestroy {
  @ViewChild('chartsContainer', { static: false }) chartsContainer!: ElementRef;

  subscription: Subscription = new Subscription();
  private ConexProductosService = inject(ConexProductosService);
  private resenaService = inject(ResenaService);
  private ConexionusuarioService = inject(ConexionusuarioService);
  private ComprobanteService = inject(ComprobanteService);
  listaProductos: Producto[] = [];
  listaUsuarios: Usuario[] = [];
  listaVentas: ComprobanteDetalleVentaModels[] = [];
  resenas: Resena[] = [];

  productosLabels: string[] = [];
  productosData: ChartData<'doughnut'> | undefined;
  productosOptions: ChartOptions<'doughnut'> | undefined;

  usuariosLabels: string[] = [];
  usuariosData: ChartData<'doughnut'> | undefined;

  ventasLabels: string[] = [];
  ventasData?: ChartData<'bar'>;
  ventasOptions: ChartOptions<'bar'> | undefined;

  resenasLabels: number[] = [];
  resenasData: ChartData<any> | undefined; // Use 'any' to accommodate multiple chart types
  resenasOptions: ChartOptions<any> | undefined;
  selectedResenasChartType: string = 'bar'; // Default chart type

  selectedFilter: string = 'month';  // Default filter is month
  selectedFilter2: string = 'categoria';  // Default filter is categoria

  codigoReporte: string;
  fechaReporte: string;

  constructor() {
    // Generar código y fecha del reporte
    this.codigoReporte = 'RGCG' + this.generateReportCode();
    this.fechaReporte = new Date().toLocaleDateString();
   }

  ngOnInit(): void {
    this.listarProductos();
    this.loadResenas();
    this.loadUsuarios();
    this.loadVentas();
    this.subscription.add(
      this.ConexProductosService.refresh$.subscribe(() => {
        this.listarProductos();
        this.loadResenas();
        this.loadVentas();
        this.loadUsuarios();
      })
    );
  }

  listarProductos(): void {
    this.subscription.add(
      this.ConexProductosService.getProductos().subscribe(
        (res: Producto[]) => {
          this.listaProductos = res;
          this.setProductosChart();
        },
        (err) => {
          console.error('Error al listar productos', err);
        }
      )
    );
  }

  loadResenas(): void {
    this.resenaService.getResenas().subscribe(
      (resenas: Resena[]) => {
        this.resenas = resenas;
        this.setResenasChart();
      },
      (error: any) => {
        console.error('Error al cargar las reseñas', error);
      }
    );
  }

  loadUsuarios(): void {
    this.ConexionusuarioService.getUsuarios().subscribe(
      (usuarios: Usuario[]) => {
        this.listaUsuarios = usuarios;
        this.setUsuariosChart();
      },
      (error: any) => {
        console.error('Error al cargar las usuarios', error);
      }
    );
  }

  loadVentas(): void {
    this.ComprobanteService.getComprobantes().subscribe(
      (ventas: ComprobanteDetalleVentaModels[]) => {
        this.listaVentas = ventas;
        this.setVentasChart();
      },
      (error: any) => {
        console.error('Error al cargar las ventas', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setProductosChart() {
    const filter = this.selectedFilter2;
    let labels: string[] = [];
    let data: number[] = [];

    switch (filter) {
      case 'categoria':
        labels = this.getUniqueValues('categoria');
        data = this.getDataByFilter('categoria', labels);
        break;
      case 'genero':
        labels = this.getUniqueValues('genero');
        data = this.getDataByFilter('genero', labels);
        break;
      case 'stock':
        labels = ['En Stock', 'Sin Stock'];
        data = this.listaProductos.reduce(
          (acc, producto) => {
            producto.stock > 0 ? acc[0]++ : acc[1]++;
            return acc;
          },
          [0, 0]
        );
        break;
      case 'estado':
        labels = this.getUniqueValues('estado');
        data = this.getDataByFilter('estado', labels);
        break;
    }

    this.productosLabels = labels;
    this.productosData = {
      labels: this.productosLabels,
      datasets: [{
        data: data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
      }]
    };
  }

  getUniqueValues(field: ProductoField): string[] {
    return Array.from(new Set(this.listaProductos.map(producto => producto[field] as unknown as string)));
  }
  
  getDataByFilter(field: ProductoField, labels: string[]): number[] {
    return labels.map(label => 
      this.listaProductos.filter(producto => (producto[field] as unknown as string) === label).length
    );
  }

  setUsuariosChart() {
    const roles = this.listaUsuarios.map(usuario => usuario.rol);
    const uniqueRoles = Array.from(new Set(roles));
    const data = uniqueRoles.map(rol =>
      this.listaUsuarios.filter(usuario => usuario.rol === rol).length
    );
    this.usuariosLabels = uniqueRoles;
    this.usuariosData = {
      labels: this.usuariosLabels,
      datasets: [{
        data: data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
      }]
    };
  }

  setVentasChart() {
    const labels: string[] = [];
    const data: number[] = [];
    const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    
    switch (this.selectedFilter) {
      case 'day':
        this.listaVentas.forEach(venta => {
          const date = new Date(venta.fecha_venta).toLocaleDateString('es-ES', dateOptions);
          const index = labels.indexOf(date);
          if (index === -1) {
            labels.push(date);
            data.push(1);
          } else {
            data[index]++;
          }
        });
        break;

      case 'month':
        this.listaVentas.forEach(venta => {
          const month = new Date(venta.fecha_venta).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
          const index = labels.indexOf(month);
          if (index === -1) {
            labels.push(month);
            data.push(1);
          } else {
            data[index]++;
          }
        });
        break;

      case 'year':
        this.listaVentas.forEach(venta => {
          const year = new Date(venta.fecha_venta).getFullYear().toString();
          const index = labels.indexOf(year);
          if (index === -1) {
            labels.push(year);
            data.push(1);
          } else {
            data[index]++;
          }
        });
        break;
    }

    this.ventasLabels = labels;
    this.ventasData = {
      labels: this.ventasLabels,
      datasets: [{
        label: 'Ventas',
        data: data,
        backgroundColor: '#36A2EB',
        datalabels: {
          display: true,
          align: 'end',
          anchor: 'end',
          formatter: (value: number, context: any) => {
            const total = (context.chart.data.datasets[0].data as number[]).reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(2) + '%';
            return `${value} (${percentage})`;
          },
          color: '#000'
        }
      }]
    };

    this.ventasOptions = {
      plugins: {
        datalabels: {
          display: true,
          align: 'end',
          anchor: 'end',
          formatter: (value: number, context: any) => {
            const total = (context.chart.data.datasets[0].data as number[]).reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(2) + '%';
            return `${value} (${percentage})`;
          },
          color: '#000'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => value + ' ventas'
          }
        }
      }
    };
  }

  setResenasChart() {
    const estrellas = this.resenas.map(resena => resena.estrella);
    const uniqueEstrellas = Array.from(new Set(estrellas)).sort((a, b) => a - b); // Orden ascendente
    const data = uniqueEstrellas.map(estrella => 
      this.resenas.filter(resena => resena.estrella === estrella).length
    );
  
    // Colores específicos para cada valor de estrella
    const backgroundColors = uniqueEstrellas.map(estrella => {
      switch (estrella) {
        case 5: return '#1d8348'; // Verde
        case 4: return '#28b463'; // Amarillo verdoso más oscuro
        case 3: return '#58d68d'; // Amarillo verdoso
        case 2: return '#abebc6'; // Amarillo verdoso claro
        case 1: return '#f7dc6f'; // Amarillo claro
        default: return '#abebc6'; // Default color
      }
    });
  
    this.resenasLabels = uniqueEstrellas;
    this.resenasData = {
      labels: this.resenasLabels,
      datasets: [{
        label: 'Reseñas',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: '#000000', // Optional: Add border color
        fill: false,
        tension: 0.1 // Suavizar las líneas
      }]
    };
  
    this.resenasOptions = {
      plugins: {
        datalabels: {
          formatter: (value: any) => {
            return value + '%';
          },
          color: '#0000FF', // Cambiar el color de las letras
          font: {
            size: 16, // Cambiar el tamaño de las letras
            weight: 'bold' // Opcional: hacer el texto en negrita
          }
        }
      }
    };
  }
  
  


  generateReportCode(): string {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    return randomNumber.toString();
  }

  async generatePDF() {
    const doc = new jsPDF('p', 'mm', 'a4');
    const chartsContainer = this.chartsContainer.nativeElement;
    const canvasElements = chartsContainer.querySelectorAll('canvas');
  
    // Load background image
    const backgroundImg = new Image();
    backgroundImg.src = 'assets/img/reporte.PNG';
    await new Promise((resolve) => {
      backgroundImg.onload = resolve;
    });
  
    // Add background image to PDF
    doc.addImage(backgroundImg, 'PNG', 0, 0, 210, 297);
  
    // Add report code and date
    doc.setFontSize(10);
    doc.text(this.codigoReporte, 60, 29); // Ajustar la posición según el diseño
    doc.text(this.fechaReporte, 60, 38);  // Ajustar la posición según el diseño
  
    // Define positions for each chart
    const positions = [
      { x: 60, y: 220, width: 80, height: 60 },  // Position for the Usuarios chart
      { x: 12, y: 145, width: 80, height: 60 },  // Position for the Productos chart
      { x: 110, y: 145, width: 85, height: 60 }, // Position for the Resenas chart
      { x: 20, y: 55, width: 180, height: 80 }   // Position for the Ventas chart
    ];
  
    for (let i = 0; i < canvasElements.length; i++) {
      const canvas = canvasElements[i];
  
      // Create a higher resolution canvas
      const scale = 2; // Adjust scale for higher resolution
      const width = canvas.width;
      const height = canvas.height;
      const highResCanvas = document.createElement('canvas');
      highResCanvas.width = width * scale;
      highResCanvas.height = height * scale;
      highResCanvas.style.width = `${width}px`;
      highResCanvas.style.height = `${height}px`;
  
      const ctx = highResCanvas.getContext('2d');
      ctx?.scale(scale, scale);
      ctx?.drawImage(canvas, 0, 0, width, height);
  
      const canvasImage = highResCanvas.toDataURL('image/png', 1.0);
      const pos = positions[i];
      doc.addImage(canvasImage, 'PNG', pos.x, pos.y, pos.width, pos.height);
    }
  
    doc.save('reporte_global.pdf');
  }
  

}
