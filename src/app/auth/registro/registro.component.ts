import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConexionusuarioService } from '../../core/services/usuario/conexionusuario.service';
import { Usuario } from '../../core/models/usuario.interface';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterModule,FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  registerForm: FormGroup;
  selectedFile: File | null = null;
  emailExists: boolean = false;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: ConexionusuarioService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      country: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }


  ngOnInit() {
    console.log("hola registro");
  }

  register() {
    if (this.registerForm.valid) {
      const email = this.registerForm.get('email')?.value;
      this.authService.checkEmailExists(email).subscribe(
        (exists: boolean) => {
          this.emailExists = exists;
          if (exists) {
            Swal.fire({
              icon: 'error',
              title: 'Correo ya registrado',
              text: 'El correo electrónico ya está registrado. Por favor, usa otro correo.',
              confirmButtonText: 'Aceptar',
              customClass: {
                confirmButton: 'swal-button--confirm'
              }
            });
          } else {
            this.registerUser();
          }
        },
        error => {
          console.error('Error checking email', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al verificar el correo. Por favor, inténtalo de nuevo.',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'swal-button--confirm'
            }
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor, llena todos los campos correctamente.',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'swal-button--confirm'
        }
      });
    }
  }

  registerUser() {
    const usuario: Usuario = {
      nombre: this.registerForm.value.firstName,
      apellido: this.registerForm.value.lastName,
      correo: this.registerForm.value.email,
      contrasena: this.registerForm.value.password,
      telefono: this.registerForm.value.phone,
      direccion: this.registerForm.value.address,
      ciudad: this.registerForm.value.city,
      provincia: this.registerForm.value.province,
      pais: this.registerForm.value.country,
      rol: 'cliente', // Puedes ajustar esto según sea necesario
      estado: 'activo'
    };

    this.authService.register(usuario, this.selectedFile!).subscribe(
      response => {
        console.log('Registration successful', response);
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: '¡Te has registrado correctamente!',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            confirmButton: 'swal-button--confirm',
          },
        });
        // Redirige al login o a la página de inicio
        this.router.navigate(['/auth/login']);
      },
      error => {
        console.error('Registration failed', error);
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: 'Hubo un problema al registrarse. Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-button--confirm'
          }
        });
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  // Custom validator to check that two fields match
  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['confirmPassword'].value ? null : { mismatch: true };
  }
}
