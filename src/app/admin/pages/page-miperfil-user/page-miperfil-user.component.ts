import { Component } from '@angular/core';
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";
import { MiperfilUserComponent } from "../../components/miperfil-user/miperfil-user.component";

@Component({
  selector: 'app-page-miperfil-user',
  standalone: true,
  imports: [SidebarComponent, MiperfilUserComponent],
  templateUrl: './page-miperfil-user.component.html',
  styleUrl: './page-miperfil-user.component.css'
})
export class PageMiperfilUserComponent {

}
