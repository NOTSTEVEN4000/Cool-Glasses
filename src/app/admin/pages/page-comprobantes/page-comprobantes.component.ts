import { Component } from '@angular/core';
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";
import { TableComprobantesComponent } from "../../components/ventas/table-comprobantes/table-comprobantes.component";

@Component({
  selector: 'app-page-comprobantes',
  standalone: true,
  imports: [SidebarComponent, TableComprobantesComponent],
  templateUrl: './page-comprobantes.component.html',
  styleUrl: './page-comprobantes.component.css'
})
export class PageComprobantesComponent {

}
