import { Component, inject } from '@angular/core';
import { Producto } from '../../../core/models/producto.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ConexProductosService } from '../../../core/services/producto/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import Swal from 'sweetalert2';
import { Carrito, CarritoService } from '../../../core/services/carrito/carrito.service';
import { AuthServiceService } from '../../../core/services/seguridad/auth-service.service';
import { FavoritoService } from '../../../core/services/favoritos/favoritos.service';

@Component({
  selector: 'app-resultados-busqueda',
  standalone: true,
  imports: [FormsModule, CommonModule, FooterComponent, NavBarComponent],
  templateUrl: './resultados-busqueda.component.html',
  styleUrl: './resultados-busqueda.component.css'
})
export class ResultadosBusquedaComponent {

  private productService = inject(ConexProductosService);
  private CarritoService = inject(CarritoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private FavoritoService = inject(FavoritoService);
  private storageService = inject(AuthServiceService);

  productos: Producto[] = [];
  query: string = '';

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

  constructor() {}

  ngOnInit(): void {

    const token = this.storageService.getToken();

    if (token !== null) {
      const tokenD = this.storageService.decodeToken(token!);

      this.carrito.usuario.nombre = tokenD.nombre;
      this.carrito.usuario.apellido = tokenD.apellido;
      this.carrito.usuario.correo = tokenD.correo;
      this.carrito.usuario.rol = tokenD.rol;
      this.carrito.usuario.estado = tokenD.estado;
    }

    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || '';
      this.searchProductos(this.query);
      
    });
  }

  redirectAndScrollToTop(route: string, Producto:any) {
    this.router.navigate([route, Producto]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  agregarAlCarrito(producto: any): void {

    const token = this.storageService.getToken();

    if (token !== null) {

      producto.cantidad_seleccionada = 1; 
      this.carrito.producto = [producto]; 
  
      this.CarritoService.addCarrito(this.carrito).subscribe(
        (res) => {
          Swal.fire({
            title: 'Producto añadido',
            text: 'El producto se ha añadido al carrito correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'swal-button--confirm',
            },
          });
          this.CarritoService.emitirActualizacionCarrito(); // Emitir evento de actualización
        },
        (err) => {
          if (err.message === 'Producto ya existe en el carrito') {
            Swal.fire({
              title: 'Producto ya existe',
              text: 'El producto ya está en el carrito.',
              icon: 'info',
              confirmButtonText: 'Aceptar',
              customClass: {
                confirmButton: 'swal-button--confirm',
              },
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al añadir el producto al carrito.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              customClass: {
                confirmButton: 'swal-button--confirm',
              },
            });
          }
        }
      );
    
    }else {
      Swal.fire({
        title: 'Producto no Añadido',
        text: 'Inicie sesión para continuar',
        icon: 'info',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'swal-button--confirm',
        },
      });
    }


  }

  agregarAFavoritos(producto: any): void {
    const token = this.storageService.getToken();

    if (token !== null) {
      const nuevoFavorito = {
        idFavorito: '',
        usuario: this.carrito.usuario,
        producto: [producto]
      };
  
      this.FavoritoService.addFavorito(nuevoFavorito).subscribe(
        (response: any) => {
          if (response.message === 'El producto ya está en la lista de favoritos') {
            Swal.fire({
              title: 'Producto ya en favoritos',
              text: 'El producto ya está en la lista de favoritos.',
              icon: 'info',
              confirmButtonText: 'Aceptar',
              customClass: {
                confirmButton: 'swal-button--confirm'
              }
            });
          } else {
            Swal.fire({
              title: 'Favorito añadido',
              text: 'El producto se ha añadido a favoritos correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              customClass: {
                confirmButton: 'swal-button--confirm'
              }
            });
          }
          this.FavoritoService.emitirActualizacionFavorito();
        },
        (err: any) => {
          console.error('Error al añadir producto a favoritos', err);
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al añadir el producto a favoritos.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'swal-button--confirm'
            }
          });
        }
      );

    }else{
      Swal.fire({
        title: 'No se pudo Añadir a Favoritos',
        text: 'Inicie sesión para continuar',
        icon: 'info',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'swal-button--confirm',
        },
      });
    }
  }

  calcularPD(precio: number, descuento: number): string {
    const descuentoAplicado = precio * (descuento / 100);
    const precioFinal = precio - descuentoAplicado;
    const precioFinalRedondeado = parseFloat(precioFinal.toFixed(2));
    return precioFinalRedondeado % 1 === 0 ? `${precioFinalRedondeado.toFixed(2)}` : `${precioFinalRedondeado}`;
  }

  searchProductos(query: string): void {
    this.productService.searchProductos(query).subscribe(productos => {
      this.productos = productos;
    });
  }
}
