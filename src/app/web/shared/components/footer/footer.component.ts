import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  private router = inject(Router);
  
  //**** Método de redireccionamiento, donde le pasamos un parametro de tipo string la ruta inicial a donde queremos llegar****/
  //** Funcional para direccionamiento entre componentes de las pages **//
  redirectAndScrollToTop(route: string) {
    this.router.navigate([route]).then(() => {
      window.scrollTo(0, 0);
    });
  }

}
