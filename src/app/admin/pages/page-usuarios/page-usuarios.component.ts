import { Component } from '@angular/core';
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";
import { TablaUsuarioComponent } from "../../components/usuario/tabla-usuario/tabla-usuario.component";

@Component({
  selector: 'app-page-usuarios',
  standalone: true,
  imports: [SidebarComponent, TablaUsuarioComponent],
  templateUrl: './page-usuarios.component.html',
  styleUrl: './page-usuarios.component.css'
})
export class PageUsuariosComponent {

}
