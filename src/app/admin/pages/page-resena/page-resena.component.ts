import { Component } from '@angular/core';
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";
import { TablaResenaComponent } from "../../components/resena/tabla-resena/tabla-resena.component";

@Component({
  selector: 'app-page-resena',
  standalone: true,
  imports: [SidebarComponent, TablaResenaComponent],
  templateUrl: './page-resena.component.html',
  styleUrl: './page-resena.component.css'
})
export class PageResenaComponent {

}
