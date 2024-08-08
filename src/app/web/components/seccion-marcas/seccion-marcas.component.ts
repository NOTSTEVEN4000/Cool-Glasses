import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-seccion-marcas',
  standalone: true,
  imports: [],
  templateUrl: './seccion-marcas.component.html',
  styleUrl: './seccion-marcas.component.css'
})
export class SeccionMarcasComponent {
  constructor(private renderer: Renderer2, private el: ElementRef) {}

 
}
