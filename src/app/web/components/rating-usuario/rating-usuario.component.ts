import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Resena, ResenaService } from '../../../core/services/resenas/resenas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rating-usuario',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, FormsModule],
  templateUrl: './rating-usuario.component.html',
  styleUrls: ['./rating-usuario.component.css']
})
export class RatingUsuarioComponent {
  estrella: number = 0;
  comentario: string = '';

  @Output() closeModal = new EventEmitter<void>();
  private resenaService = inject(ResenaService);

  constructor() {}

  setRating(rating: number): void {
    this.estrella = rating;
  }

  submit(): void {
    const nuevaResena: Resena = {
      idResena: '', // Se generará en el backend
      estrella: this.estrella,
      comentario: this.comentario
    };

    this.resenaService.addResena(nuevaResena).subscribe(
      (resena: any) => {
        console.log('Reseña guardada:', resena);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Su reseña ha sido guardada exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-button--confirm'
          }
        }).then(() => {
          this.closeModal.emit();
        });
      },
      (error: any) => {
        console.error('Error al guardar la reseña:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al guardar su reseña. Por favor, inténtelo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-button--confirm'
          }
        });
      }
    );
  }
}
