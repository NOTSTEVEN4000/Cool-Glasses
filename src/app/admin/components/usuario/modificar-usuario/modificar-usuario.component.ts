import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ConexionusuarioService, Usuario } from '../../../../core/services/usuario/conexionusuario.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-usuario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modificar-usuario.component.html',
  styleUrls: ['./modificar-usuario.component.css']
})
export class ModificarUsuarioComponent {

  @Output() closeModal = new EventEmitter<void>();
  @Input() data: any;
  private usuarioService = inject(ConexionusuarioService);
  subscription: Subscription | undefined;

  usuario: Usuario = {
    id: '',
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    pais: '',
    rol: '',
    estado: ''
  };

  constructor(){
    this.cargar();
  }

  cargar() {
    this.subscription = this.usuarioService.datos$.subscribe((datos) => {
      this.usuario = { ...datos};
    });
  }

  ngOnDestroy(): void {
    this.subscription!.unsubscribe();
  }
  guardarUsuario(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas guardar los cambios?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.editUsuario(this.usuario.id!, this.usuario).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Guardado!',
            text: 'Los cambios han sido guardados.',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'swal-button--confirm'
            }
          });

          this.limpiar();
          this.closeModal.emit();
        }, (err) => {
          console.error('Error al guardar usuario', err);

          Swal.fire({
            title: 'Error!',
            text: 'Hubo un problema al guardar los cambios.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'swal-button--confirm'
            }
          });
        });
      }
    });
  }


  limpiar(): void {
    this.usuario = {
      id: '',
      nombre: '',
      apellido: '',
      correo: '',
      contrasena: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      provincia: '',
      pais: '',
      rol: '',
      estado: ''
    };
  }

}
