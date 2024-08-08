import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConexionusuarioService, Usuario } from '../../../core/services/usuario/conexionusuario.service';
import { AuthServiceService } from '../../../core/services/seguridad/auth-service.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-miperfil-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './miperfil-user.component.html',
  styleUrl: './miperfil-user.component.css'
})
export class MiperfilUserComponent {

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
  
  profileImageUrl: any | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private conexionusuarioService: ConexionusuarioService,private storageService: AuthServiceService) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const token = this.storageService.getToken();
    const tokenD = this.storageService.decodeToken(token!);
    console.log('Token Desincriptado:', tokenD);

    const userId = tokenD.id; 
    this.conexionusuarioService.getUsuario(userId).subscribe(
      (data: Usuario) => {
        this.usuario = data;
        if (data.fotoPerfil) {
          this.profileImageUrl = `data:image/jpeg;base64,${data.fotoPerfil}`;
        }
      },
      error => {
        console.error('Error al cargar los datos del usuario:', error);
      }
    );
  }

  triggerFileInput(): void {
    document.getElementById('profileImageInput')!.click();
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImageUrl = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  updateUser(): void {
    console.log(this.selectedFile);
    if (this.selectedFile) {
      this.conexionusuarioService.editUsuario(this.usuario.id!, this.usuario, this.selectedFile).subscribe(
        response => {
          console.log('Usuario actualizado:', response);
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'El usuario ha sido actualizado correctamente.',
            customClass: {
              confirmButton: 'swal-button--confirm'
            }
          });
        },
        error => {
          console.error('Error al actualizar el usuario:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al actualizar el usuario. Inténtalo de nuevo más tarde.',
          });
        }
      );
    } else {
      this.conexionusuarioService.editUsuario(this.usuario.id!, this.usuario).subscribe(
        response => {
          console.log('Usuario actualizado:', response);
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'El usuario ha sido actualizado correctamente.',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'swal-button--confirm'
            }
          });
        },
        error => {
          console.error('Error al actualizar el usuario:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al actualizar el usuario. Inténtalo de nuevo más tarde.',
          });
        }
      );
    }
  }
  
}