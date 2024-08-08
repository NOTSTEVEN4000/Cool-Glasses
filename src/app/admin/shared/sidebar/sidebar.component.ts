
import { Router, RouterModule } from '@angular/router';
import { AfterViewInit, Component, OnInit, Renderer2, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { DropdownUserComponent } from "../dropdown-user/dropdown-user.component";
import { ThemeServiceService } from '../../../core/services/service-theme/theme-service.service';
import { AuthServiceService } from '../../../core/services/seguridad/auth-service.service';
import { ConexionusuarioService, Usuario } from '../../../core/services/usuario/conexionusuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, NgFor, NgIf, DropdownUserComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  private drawerId = 'logo-sidebar';
  private overlayId = 'background-overlays';
  private dropdownStates: { [key: string]: boolean } = {};
  constructor(private renderer: Renderer2, private themeservice: ThemeServiceService,private authService: AuthServiceService,private router: Router) {}

  ngOnInit() {
    this.initializeDrawer();
    this.loadUserData();
  }

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
      error => {
        console.error('Error al cargar los datos del usuario:', error);
      }
    );
  }
  private storageService = inject(AuthServiceService);
  private conexionusuarioService = inject(ConexionusuarioService);
  profileImageUrl: any | ArrayBuffer | null = null;
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
  initializeDrawer() {
    const drawer = document.getElementById(this.drawerId);
    const overlay = document.getElementById(this.overlayId);
    if (drawer && overlay) {
      this.renderer.listen(overlay, 'click', () => {
        this.closeDrawer();
      });
    }
  }

  toggleDrawer() {
    const drawer = document.getElementById(this.drawerId);
    const overlay = document.getElementById(this.overlayId);
    if (drawer && overlay) {
      if (drawer.classList.contains('-translate-x-full')) {
        this.openDrawer(drawer, overlay);
      } else {
        this.closeDrawer();
      }
    }
  }

  openDrawer(drawer: HTMLElement, overlay: HTMLElement) {
    this.renderer.removeClass(drawer, '-translate-x-full');
    this.renderer.addClass(drawer, 'translate-x-0');
    this.renderer.removeClass(overlay, 'hidden');
    this.renderer.addClass(overlay, 'flex');
  }

  closeDrawer() {
    const drawer = document.getElementById(this.drawerId);
    const overlay = document.getElementById(this.overlayId);
    if (drawer && overlay) {
      this.renderer.addClass(drawer, '-translate-x-full');
      this.renderer.removeClass(drawer, 'translate-x-0');
      this.renderer.addClass(overlay, 'hidden');
      this.renderer.removeClass(overlay, 'flex');
    }
  }

  toggleDropdown(id: string): void {
    this.dropdownStates[id] = !this.dropdownStates[id];
  }

  isDropdownOpen(id: string): boolean {
    return this.dropdownStates[id] || false;
  }

  logout() {
    this.authService.logout();
    this.themeservice.clearTheme();
    this.router.navigate(['/auth/login']).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'swal-button--confirm'
        }
        
      });
      console.log('User logged out and redirected to login page');
    });
  }
}
