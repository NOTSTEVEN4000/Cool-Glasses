import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { TablaProductoComponent } from "../../components/producto/tabla-producto/tabla-producto.component";
import { RegistroProductoComponent } from "../../components/producto/registro-producto/registro-producto.component";
import { InicioAdminComponent } from "../../components/inicio-admin/inicio-admin.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, TablaProductoComponent, RegistroProductoComponent, InicioAdminComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
