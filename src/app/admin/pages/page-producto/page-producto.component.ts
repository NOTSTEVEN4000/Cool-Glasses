import { Component } from '@angular/core';
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";
import { TablaProductoComponent } from "../../components/producto/tabla-producto/tabla-producto.component";

@Component({
  selector: 'app-page-producto',
  standalone: true,
  imports: [SidebarComponent, TablaProductoComponent],
  templateUrl: './page-producto.component.html',
  styleUrl: './page-producto.component.css'
})
export class PageProductoComponent {

}
