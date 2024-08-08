import { CommonModule } from '@angular/common';
import { Component, inject, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeServiceService } from '../../../core/services/service-theme/theme-service.service';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../../core/services/seguridad/auth-service.service';
import { ConexionusuarioService, Usuario } from '../../../core/services/usuario/conexionusuario.service';

@Component({
  selector: 'app-dropdown-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dropdown-user.component.html',
  styleUrl: './dropdown-user.component.css'
})
export class DropdownUserComponent {
  private storageService = inject(AuthServiceService);
  private conexionusuarioService = inject(ConexionusuarioService);
  ngOnInit(): void {
    this.loadUserData();
  }
  isDropdownOpen = false;
  mode: string;

  constructor(private themeService: ThemeServiceService) {
    this.mode = this.themeService.getMode();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  setMode(mode: string) {
    this.themeService.setMode(mode);
    this.mode = mode;
  }
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

  loadUserData(): void {
    const token = this.storageService.getToken();
    const tokenD = this.storageService.decodeToken(token!);
    const userId = tokenD.id; 
    this.conexionusuarioService.getUsuario(userId).subscribe(
      (data: Usuario) => {
        this.usuario = data;
        if (data.fotoPerfil) {
          this.profileImageUrl = `data:image/jpeg;base64,${data.fotoPerfil}`;
        }
      },
      (error: any) => {
        console.error('Error al cargar los datos del usuario:', error);
      }
    );
  }
}
