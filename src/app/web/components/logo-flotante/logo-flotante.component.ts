import { Component } from '@angular/core';
import { RatingUsuarioComponent } from "../rating-usuario/rating-usuario.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo-flotante',
  standalone: true,
  imports: [RatingUsuarioComponent, FormsModule, CommonModule],
  templateUrl: './logo-flotante.component.html',
  styleUrl: './logo-flotante.component.css'
})
export class LogoFlotanteComponent {
  showModal = false;

  openRatingDialog(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
