import { NgFor, NgIf } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ModificarUsuarioComponent } from "../modificar-usuario/modificar-usuario.component";
import { ConexionusuarioService, Usuario } from '../../../../core/services/usuario/conexionusuario.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { ServiceBuscadorService } from '../../../../core/services/service-buscador/service-buscador.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabla-usuario',
  standalone: true,
  imports: [NgIf, NgFor, ModificarUsuarioComponent, FormsModule],
  templateUrl: './tabla-usuario.component.html',
  styleUrls: ['./tabla-usuario.component.css']
})
export class TablaUsuarioComponent implements OnInit {

  showModal: boolean = false;
  isRegistrar: boolean = true;
  @Input() data: any; 
  listaUsuarios: Usuario[] = [];
  searchTerm: string = '';
  autocompleteSuggestions: string[] = [];
  errorMessage: string = '';
  subscription: Subscription = new Subscription();
  private serviceBuscador = inject(ServiceBuscadorService);
  private usuarioService = inject(ConexionusuarioService);

  constructor() {}


  ngOnInit(): void {
    this.listarUsuarios();
    this.subscription.add(
      this.usuarioService.refresh$.subscribe(() => {
        this.listarUsuarios();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  listarUsuarios(): void {
    this.subscription.add(
      this.usuarioService.getUsuarios().subscribe(
        (res: Usuario[]) => {
          this.listaUsuarios = res;
        },
        (err) => {
          console.error('Error al listar usuarios', err);
          this.errorMessage = 'Error al listar usuarios: ' + err.message;
        }
      )
    );

  }

  eliminarUsuario(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteUsuario(id).subscribe(() => {
          Swal.fire({
            title: 'Eliminado!',
            text: 'El usuario ha sido eliminado.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'swal-button--confirm'
            }
          });
        }, (err) => {
          console.error('Error al eliminar usuario', err);
          this.errorMessage = 'Error al eliminar usuario: ' + err.message;
        });
      }
    });
  }
  
  enviardata(item: any) {
    this.data = item
    this.usuarioService.enviarDatos(this.data)
  }


  openModificarModal(): void {
    this.isRegistrar = false;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }


  filterUsers(): void {
    if (!this.searchTerm) {
      this.listaUsuarios = this.listaUsuarios;
      this.autocompleteSuggestions = [];
      this.listarUsuarios();
    } else {
      this.listaUsuarios = this.serviceBuscador.filterUsers(this.listaUsuarios, this.searchTerm);
      this.autocompleteSuggestions = this.serviceBuscador.getUserAutocompleteSuggestions(this.listaUsuarios, this.searchTerm);
    }
  }

  selectSuggestion(suggestion: string): void {
    this.searchTerm = suggestion;
    this.filterUsers();
  }
}
