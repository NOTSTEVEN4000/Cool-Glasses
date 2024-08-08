import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListarImagenesGalleryService {

  constructor() { }

  private imagenes = {
    hombres: [
      'assets/img/galeria-imagenes/hombre/galeria-hombre1.jpg',
      'assets/img/galeria-imagenes/hombre/galeria-hombre4.jpg',
      'assets/img/galeria-imagenes/hombre/galeria-hombre3.webp',
      'assets/img/galeria-imagenes/hombre/galeria-hombre2.jpg',
      'assets/img/galeria-imagenes/hombre/galeria-hombre5.webp',
      'assets/img/galeria-imagenes/hombre/galeria-hombre6.webp'
    ],
    mujeres: [
      'assets/img/galeria-imagenes/mujeres/galeria-mujer1.jpg',
      'assets/img/galeria-imagenes/mujeres/galeria-mujer2.jpg',
      'assets/img/galeria-imagenes/mujeres/galeria-mujer3.jpg',
      'assets/img/galeria-imagenes/mujeres/galeria-mujer4.jpg',
      'assets/img/galeria-imagenes/mujeres/galeria-mujer5.jpg',
      'assets/img/galeria-imagenes/mujeres/galeria-mujer6.jpg'
    ],
    ninos: [
      'assets/img/galeria-imagenes/ninos/galeria-nino1.jpg',
      'assets/img/galeria-imagenes/ninos/galeria-nino2.jpg',
      'assets/img/galeria-imagenes/ninos/galeria-nino3.jpg',
      'assets/img/galeria-imagenes/ninos/galeria-nino4.jpg',
      'assets/img/galeria-imagenes/ninos/galeria-nino5.jpg',
      'assets/img/galeria-imagenes/ninos/galeria-nino6.jpg'
    ]
  };

  getImagenes(categoria: 'hombres' | 'mujeres' | 'ninos'): string[] {
    return this.imagenes[categoria];
  }
}
