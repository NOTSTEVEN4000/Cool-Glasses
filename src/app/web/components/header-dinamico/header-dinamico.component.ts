import { Component, OnInit } from '@angular/core';
import Typed from 'typed.js';

@Component({
  selector: 'app-header-dinamico',
  standalone: true,
  imports: [],
  templateUrl: './header-dinamico.component.html',
  styleUrl: './header-dinamico.component.css'
})
export class HeaderDinamicoComponent implements OnInit {
  ngOnInit(): void {
    const options = {
      strings: [
        '<i>ESTILO</i>',
        '<i>SER</i>',
        '<i>PERSONALIDAD</i>',
        '<i>ELEGANCIA</i>',
        '<i>CLASE</i>',
      ],
      typeSpeed: 75, // Velocidad en milisegundos para poner una letra
      startDelay: 300, // Tiempo de retraso en iniciar la animación
      backSpeed: 75, // Velocidad en milisegundos para borrar una letra
      smartBackspace: true, // Eliminar solamente las palabras que sean nuevas en una cadena de texto
      shuffle: false, // Alterar el orden en el que escribe las palabras
      backDelay: 1500, // Tiempo de espera después de que termina de escribir una palabra
      loop: true, // Repetir el array de strings
      loopCount: Infinity, // Cantidad de veces a repetir el array. Infinity = infinito
      showCursor: true, // Mostrar cursor palpitante
      cursorChar: '|', // Caracter para el cursor
      contentType: 'html', // 'html' o 'null' para texto sin formato
    };
    new Typed('.typed', options);
  }

}
