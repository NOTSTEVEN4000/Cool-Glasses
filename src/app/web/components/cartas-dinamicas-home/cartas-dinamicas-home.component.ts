import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cartas-dinamicas-home',
  standalone: true,
  imports: [],
  templateUrl: './cartas-dinamicas-home.component.html',
  styleUrl: './cartas-dinamicas-home.component.css'
})
export class CartasDinamicasHomeComponent {

  private router = inject(Router);

  redirectAndScrollToTop(route: string) {
    this.router.navigate([route]).then(() => {
      window.scrollTo(0, 0);
    });
  }
  
}
