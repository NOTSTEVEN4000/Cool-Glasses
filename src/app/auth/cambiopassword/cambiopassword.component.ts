import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CambiopasswordService } from '../../core/services/cambiopassword/cambiopassword.service';
import { Router, RouterLink } from '@angular/router';
import { ConexionusuarioService } from '../../core/services/usuario/conexionusuario.service';

@Component({
  selector: 'app-cambiopassword',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './cambiopassword.component.html',
  styleUrls: ['./cambiopassword.component.css']
})
export class CambiopasswordComponent {
  recoveryEmail: string = '';
  recoveryCode: string = '';
  newPassword: string = '';
  showPassword: boolean = false;
  showChangePasswordForm: boolean = false;

  constructor(
    private cambioPasswordService: CambiopasswordService,
    private conexionUsuarioService: ConexionusuarioService,
    private router: Router
  ) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmitRecoveryEmail() {
    this.conexionUsuarioService.checkEmailExists(this.recoveryEmail).subscribe(
      (emailExists: boolean) => {
        if (emailExists) {
          this.cambioPasswordService.recuperarContrasena(this.recoveryEmail).subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Código de recuperación enviado a tu correo',
                confirmButtonText: 'Aceptar',
                customClass: {
                  confirmButton: 'swal-button--confirm'
                }
              })
            },
          );
          this.showChangePasswordForm = true;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Fallido',
            text: 'Correo no registrado en el sistema',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'swal-button--confirm'
            }
          });
          this.showChangePasswordForm = false;
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al verificar el correo electrónico. Inténtalo de nuevo más tarde.',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-button--confirm'
          }
        });
        console.error('Error al verificar el correo electrónico:', error);
      }
    );
  }

  onSubmitChangePassword() {
    if (this.recoveryEmail !== '' && this.recoveryCode !== '' && this.newPassword !== '') {
      this.cambioPasswordService.cambiarContrasena(this.recoveryEmail, this.recoveryCode, this.newPassword).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Contraseña cambiada exitosamente',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'swal-button--confirm'
            }
          });
          this.router.navigate(['/auth/login']);
          this.showChangePasswordForm = false;
          this.recoveryEmail = '';
          this.recoveryCode = '';
          this.newPassword = '';
        }
      );

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Llene todos los campos',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'swal-button--confirm'
        }
      });
    }
  }
}
