import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-galleria-imagenes',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './galleria-imagenes.component.html',
  styleUrl: './galleria-imagenes.component.css'
})
export class GalleriaImagenesComponent {
  @Input() imagenes: string[] = [];
}
