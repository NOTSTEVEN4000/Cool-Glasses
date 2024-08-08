import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConexionusuarioService } from '../../core/services/usuario/conexionusuario.service';
import { AuthServiceService } from '../../core/services/seguridad/auth-service.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(
    private authService: ConexionusuarioService,
    private storageService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('hola login');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async login() {
    const credentials = { correo: this.email, contrasena: this.password };
    console.log('Logging in with credentials:', credentials);
    this.authService.login(credentials).subscribe(
      async (response: any) => {
        Swal.fire({
          title: 'Inicio Sesión Exitoso!!',
          icon: 'success',
          confirmButtonText: 'Continuar',
          customClass: {
            confirmButton: 'swal-button--confirm',
          },
        });
        await this.storageService.setToken(response.token);
        this.storageService.setUserRole(response.usuario.rol); // Establecer el rol del usuario

        const token = this.storageService.getToken();
        console.log('Retrieved token:', token);
        const tokenD = this.storageService.decodeToken(token!);
        console.log('Token Desincriptado:', tokenD);

        if (response.usuario.rol === 'administrador') {
          this.router.navigate(['/dashboard/inicio']);
        } else {
          this.router.navigate(['/bienvenida']);
        }
      },
      error => {

        Swal.fire({
          title: 'Error al Iniciar Sesión',
          text: 'Por favor! Compruebe sus credenciales!',
          icon: 'error',
          confirmButtonText: 'Continuar',
          customClass: {
            confirmButton: 'swal-button--confirm',
          },
        });

        console.error('Login failed:', error);
        console.error('Error details:', error.error);
      }
    );
  }


}