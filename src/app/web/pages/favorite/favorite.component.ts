import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { Carrito, CarritoService } from '../../../core/services/carrito/carrito.service';
import { Favorito } from '../../../core/models/favorito.interface';
import Swal from 'sweetalert2';
import { FavoritoService } from '../../../core/services/favoritos/favoritos.service';
import { EventType } from '@angular/router';
import { AuthServiceService } from '../../../core/services/seguridad/auth-service.service';

interface FavoriteItem {
  id: number;
  codUnico: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  completo: any; 
}

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, NavBarComponent, FooterComponent],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
export class FavoriteComponent implements OnInit {
  private favoritoService = inject(FavoritoService);
  private carritoService = inject(CarritoService);
  private storageService = inject(AuthServiceService);

  @Output() enviarFav = new EventEmitter<EventType>();
  
  favoriteItems: any[] = [];
  correoUsuario:string ='';

  carrito: Carrito = {
    id_carrito: '',
    usuario: {
      nombre: '',
      apellido: '',
      correo: '',
      rol: '',
      estado: ''
    },
    producto: [],
    estado: 'pendiente'
  };

  ngOnInit(): void {
    this.loadFavoritos();
  }

  loadFavoritos(): void {

    const token = this.storageService.getToken();

    if (token !== null) {
      const tokenD = this.storageService.decodeToken(token!);
      console.log('Token Desincriptado:', tokenD);
      this.correoUsuario = tokenD.correo;
      this.carrito.usuario.nombre = tokenD.nombre;
      this.carrito.usuario.apellido = tokenD.apellido;
      this.carrito.usuario.correo = tokenD.correo;
      this.carrito.usuario.rol = tokenD.rol;
      this.carrito.usuario.estado = tokenD.estado;
    }
    

    this.favoritoService.getFavoritoByCorreo(this.correoUsuario).subscribe(
      (favorito: Favorito) => {
        this.favoriteItems = favorito.producto
          .filter(producto => producto.estado === 'activo') 
          .map(producto => ({
            id: producto.id,
            codUnico: producto.codUnico,
            name: producto.nombre,
            categoria: producto.categoria,
            genero: producto.genero,
            description: producto.descripcion,
            price: producto.precio,
            stock: producto.stock,
            offer: producto.descuento,
            imageUrl: producto.imagenes[0],
            completo: producto
          }));
      },
      (error: any) => {
        console.error('Error al cargar los favoritos', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al cargar tus favoritos.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-button--confirm'
          }
        });
      }
    );
  }

  handleClick(flag: boolean, id: number): void {
    const chevronDown = document.getElementById(`chevronDown${id}`);
    const chevronUp = document.getElementById(`chevronUp${id}`);
    const menu = document.getElementById(`menu${id}`);
    if (flag) {
      menu?.classList.toggle('hidden');
      chevronDown?.classList.toggle('hidden');
      chevronUp?.classList.toggle('hidden');
    }
  }

  removeFavorite(itemCodUnico: string): void {

    this.favoritoService.deleteProductoFromFavorito(this.correoUsuario, itemCodUnico).subscribe(
      () => {
        this.favoriteItems = this.favoriteItems.filter(item => item.codUnico !== itemCodUnico);
        Swal.fire({
          title: 'Eliminado',
          text: 'El producto ha sido eliminado de tus favoritos.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-button--confirm'
          }
        });
      },
      (error: any) => {
        console.error('Error al eliminar el producto de los favoritos', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al eliminar el producto de tus favoritos.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-button--confirm'
          }
        });
      }
    );
  }

  agregarAlCarrito(item: FavoriteItem): void {
    const productoCompleto = { ...item.completo, cantidad_seleccionada: 1 }; // Agregar cantidad seleccionada al producto completo
    this.carrito.producto = [productoCompleto]; // Enviar el producto completo

    this.carritoService.addCarrito(this.carrito).subscribe(
      res => {
        Swal.fire({
          title: 'Producto añadido',
          text: 'El producto se ha añadido al carrito correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-button--confirm'
          }
        });
        this.carritoService.emitirActualizacionCarrito(); // Emitir evento de actualización
      },
      err => {
        if (err.message === 'Producto ya existe en el carrito') {
          Swal.fire({
            title: 'Producto ya existe',
            text: 'El producto ya está en el carrito.',
            icon: 'info',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'swal-button--confirm'
            }
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al añadir el producto al carrito.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'swal-button--confirm'
            }
          });
        }
      }
    );
  }

  calcularPD(precio: number, descuento: number): string {
    const descuentoAplicado = precio * (descuento / 100);
    const precioFinal = precio - descuentoAplicado;
    const precioFinalRedondeado = parseFloat(precioFinal.toFixed(2));
    return precioFinalRedondeado % 1 === 0 ? `${precioFinalRedondeado.toFixed(2)}` : `${precioFinalRedondeado}`;
  }
  
}
