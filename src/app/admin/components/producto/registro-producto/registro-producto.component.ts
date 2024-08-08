import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConexProductosService, Producto } from '../../../../core/services/producto/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro-producto.component.html',
  styleUrls: ['./registro-producto.component.css']
})
export class RegistroProductoComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  private ConexProductosService = inject(ConexProductosService);
  productoForm: FormGroup;
  discountOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 99];
  auximg: any = '';

  predefinedColors: { name: string, rgb: string, selected: boolean }[] = [
    { name: 'Negro', rgb: '#000000', selected: false },
    { name: 'Gris', rgb: '#808080', selected: false },
    { name: 'Azul', rgb: '#0000FF', selected: false },
    { name: 'Rojo', rgb: '#FF0000', selected: false },
    { name: 'Verde', rgb: '#008000', selected: false },
    { name: 'Amarillo', rgb: '#FFFF00', selected: false },
    { name: 'Naranja', rgb: '#FFA500', selected: false },
    { name: 'Rosa', rgb: '#FFC0CB', selected: false },
    { name: 'Morado', rgb: '#800080', selected: false },
    { name: 'Marrón', rgb: '#A52A2A', selected: false }
  ];

  predefinedMarcas: { name: string, value: string, selected: boolean }[] = [
    { name: 'Armani Exchange', value: 'Armani Exchange', selected: false },
    { name: 'Dolce Gabbana', value: 'Dolce Gabbana', selected: false },
    { name: 'Giorgio Armani', value: 'Giorgio Armani', selected: false },
    { name: 'Michael Kors', value: 'Michael Kors', selected: false },
    { name: 'Oakley', value: 'Oakley', selected: false },
    { name: 'Persol', value: 'Persol', selected: false },
    { name: 'Polo Ralph Lauren', value: 'Polo Ralph Lauren', selected: false },
    { name: 'Ray Ban', value: 'Ray Ban', selected: false },
    { name: 'Versace', value: 'Versace', selected: false },
    { name: 'Vogue', value: 'Vogue', selected: false },
    { name: 'Vogue Eyewear', value: 'Vogue Eyewear', selected: false }
  ];
  
  constructor(private fb: FormBuilder) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      categoria: ['', Validators.required],
      genero: ['', Validators.required],
      oferta: ['', Validators.required],
      descuento: ['', Validators.required],
      stock: ['', Validators.required],
      color: ['', Validators.required],
      material: ['', Validators.required],
      tipo: ['', Validators.required],
      tamano: ['', Validators.required],
      modelo: ['', Validators.required],
      marca: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagenes: this.fb.array([this.fb.control('', Validators.required)])
    });

    this.productoForm.get('oferta')?.valueChanges.subscribe(value => {
      if (value === 'false') {
        this.productoForm.get('descuento')?.setValue(0);
      }
    });
  }

  ngOnInit(): void {}

  get imagenes(): FormArray {
    return this.productoForm.get('imagenes') as FormArray;
  }

  addImagen(): void {
    if(this.imagenes.length<=3){
      this.imagenes.push(this.fb.control('', Validators.required));
    }
  }

  removeImagen(index: number): void {
    if (this.imagenes.length > 1) {
      this.imagenes.removeAt(index);
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.productoForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  GuardarProducto() {
    if (this.productoForm.valid) {
      const formValue = this.productoForm.value;
      const imagenes = formValue.imagenes;

      const product: Producto = {
        id: '',
        codUnico: '',
        nombre: formValue.nombre,
        precio: formValue.precio,
        descuento: formValue.descuento,
        categoria: formValue.categoria,
        imagenes: imagenes,
        caracteristicas: {
          color: formValue.color,
          material: formValue.material,
          tipo: formValue.tipo,
          tamano: formValue.tamano,
          modelo: formValue.modelo,
          marca: formValue.marca,
        },
        descripcion: formValue.descripcion,
        genero: formValue.genero,
        oferta: formValue.oferta === 'true',
        stock: formValue.stock,
        estado: 'activo'
      };

      console.log(product);

      this.ConexProductosService.addProducto(product).subscribe(() => {
        //Swal.fire('Insertado!', 'El producto ha sido insertado.', 'success');

        Swal.fire({
          title: 'Insertado!',
          text: 'El producto ha sido insertado.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-button--confirm'
          }
        });

        this.closeModal.emit();
        this.limpiar();
      }, (err) => {
        console.error('Error al insertar producto', err);
        //Swal.fire('Error!', 'Hubo un problema al insertar el producto.', 'error');
        Swal.fire({
          title: 'Error!',
          text: 'Hubo un problema al insertar el producto.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-button--confirm'
          }
        });
      });
    }
  }
  limpiar(): void {
    this.productoForm.reset();
    this.imagenes.clear();
    this.addImagen();
  }
}
