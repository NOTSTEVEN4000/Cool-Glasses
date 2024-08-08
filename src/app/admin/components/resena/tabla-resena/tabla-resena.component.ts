import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Resena, ResenaService } from '../../../../core/services/resenas/resenas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tabla-resena',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './tabla-resena.component.html',
  styleUrls: ['./tabla-resena.component.css']
})
export class TablaResenaComponent implements OnInit {

  showModal: boolean = false;
  isRegistrar: boolean = true;
  resenas: Resena[] = [];
  private resenaService = inject(ResenaService);
  constructor() {}

  ngOnInit(): void {
    this.loadResenas();
  }

  loadResenas(): void {
    this.resenaService.getResenas().subscribe(
      (resenas: Resena[]) => {
        this.resenas = resenas;
      },
      (error: any) => {
        console.error('Error al cargar las reseñas', error);
      }
    );
  }

  openModificarModal(): void {
    this.isRegistrar = false;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  deleteResena(id: string): void {
    this.resenaService.deleteResena(id).subscribe(
      () => {
        this.resenas = this.resenas.filter(resena => resena.idResena !== id);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La reseña se eliminó exitosamente.',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-button--confirm'
          }
        });
      },
      (error: any) => {
        console.error('Error al eliminar la reseña', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al eliminar la reseña.',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-button--confirm'
          }
        });
      }
    );
  }
}
