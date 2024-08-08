import { Component, ElementRef, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComprobanteService } from '../../../core/services/comprobante/comprobante.service';  // Asegúrate de usar la ruta correcta a tu servicio
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ComprobanteDetalleVentaModels } from '../../../core/services/comprobante/comprobante.service'; 
import { AuthServiceService } from '../../../core/services/seguridad/auth-service.service';

@Component({
  selector: 'app-comprobantes',
  standalone: true,
  imports: [
    NavBarComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ],
  providers: [DatePipe, DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './comprobantes.component.html',
  styleUrls: ['./comprobantes.component.css']
})
export class ComprobantesComponent implements OnInit {
  @ViewChild('pdfContainer') pdfContainer!: ElementRef;
  comprobantes: ComprobanteDetalleVentaModels[] = [];
  subcription: Subscription = new Subscription();
  p = 1;

  constructor(
    private comprobanteService: ComprobanteService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private authService: AuthServiceService
  ) { }

  ngOnInit(): void {
    this.listarComprobantes();
    this.subcription = this.comprobanteService.refresh$.subscribe(() => {
      this.listarComprobantes();
    });
  }

  listarComprobantes(): void {
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token!);
    const userEmail = decodedToken ? decodedToken.correo : null;

    if (userEmail) {
      this.subcription.add(
        this.comprobanteService.getComprobanteByCorreo(userEmail).subscribe(
          (response: ComprobanteDetalleVentaModels[]) => {
            this.comprobantes = response;
          },
          (error: any) => {
            console.error('Error al obtener los comprobantes de venta:', error);
          }
        )
      );
    } else {
      console.error('No se pudo obtener el correo del usuario.');
    }
  }

  generatePDF() {
    const content = this.pdfContainer.nativeElement;
    const screenWidth = window.innerWidth;
    const orientation = screenWidth < 990 ? 'portrait' : 'landscape';
    const doc = new jsPDF(orientation, 'mm', 'a4');
    doc.setFontSize(18);
    
    let imgWidth = 190;
    let imgHeight = 0;
    let x = 0;
    if (screenWidth < 990) {
      imgWidth = 140;
      x = 30;
      doc.text('COMPROBANTE COOL GLASSES', 105, 15, { align: 'center' });
    } else {
      doc.text('COMPROBANTE COOL GLASSES', 105, 15, { align: 'left' });
      imgWidth = 270;
      x = 10;
    }
    
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', x, 25, imgWidth, imgHeight);
      doc.save('comprobante.pdf');
    });
  }

  onPageChange(event: number): void {
    this.p = event;
  }
}
