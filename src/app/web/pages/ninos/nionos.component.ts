import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { GalleriaImagenesComponent } from "../../components/galleria-imagenes/galleria-imagenes.component";
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { ListarImagenesGalleryService } from '../../components/galleria-imagenes/listar-imagenes-gallery.service';
import { Producto } from '../../../core/models/producto.interface';
import { Subscription } from 'rxjs';
import { ConexProductosService } from '../../../core/services/producto/product.service';
import { CarritoService } from '../../../core/services/carrito/carrito.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Carrito } from '../../../core/models/carrito.interface';
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { FavoritoService } from '../../../core/services/favoritos/favoritos.service';
import { AuthServiceService } from '../../../core/services/seguridad/auth-service.service';


@Component({
  selector: 'app-nionos',
  standalone: true,
  imports: [FormsModule, NgIf, GalleriaImagenesComponent, NgFor, RouterLink, NavBarComponent, FooterComponent, NgStyle],
  templateUrl: './nionos.component.html',
  styleUrls: ['./nionos.component.css']
})
export class NionosComponent implements OnInit, OnDestroy {
  private ConexProductosService = inject(ConexProductosService);
  private CarritoService = inject(CarritoService);
  private FavoritoService = inject(FavoritoService); // Inyectar el servicio de favoritos
  private imagenesService = inject(ListarImagenesGalleryService);
  private router = inject(Router);
  private storageService = inject(AuthServiceService);

  page: string = 'ninos'; // Cambia esto según la página actual
  imagenes: string[] = [];
  listaProductos: Producto[] = [];
  filteredProductos: Producto[] = [];
  selectedColors: string[] = [];
  precioDesde!: any;
  precioHasta!: any;
  
  // Variables for checkboxes
  filterLentesSol: boolean = false;
  filterBifocales: boolean = false;
  filterLuz: boolean = false;
  filterTransitions: boolean = false;
  showDescuentoOnly: boolean = false;
  showNoDescuentoOnly: boolean = false;
  selectedCategories: string[] = [];
  subscription: Subscription = new Subscription();

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
      console.log('Token Desincriptado:', tokenD);

      this.carrito.usuario.nombre = tokenD.nombre;
      this.carrito.usuario.apellido = tokenD.apellido;
      this.carrito.usuario.correo = tokenD.correo;
      this.carrito.usuario.rol = tokenD.rol;
      this.carrito.usuario.estado = tokenD.estado;
    }

    this.listarProductos();
    this.applyFilters();
    this.subscription.add(
      this.ConexProductosService.refresh$.subscribe(() => {
        this.listarProductos();
      })
    );
    if (this.page === 'ninos') {
      this.imagenes = this.imagenesService.getImagenes('ninos');
    }
  }

  redirectAndScrollToTop(route: string, Producto:any) {
    this.router.navigate([route, Producto]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  listarProductos(): void {
    this.subscription.add(
      this.ConexProductosService.getProductosByGenero('nino').subscribe(
        (res: Producto[]) => {
          this.listaProductos = res;
          this.filteredProductos = this.applyFilters();
          console.log('Productos cargados correctamente', this.listaProductos);
        },
        (err) => {
          console.error('Error al listar productos', err);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  calcularPD(precio: number, descuento: number): string {
    const descuentoAplicado = precio * (descuento / 100);
    const precioFinal = precio - descuentoAplicado;
    const precioFinalRedondeado = parseFloat(precioFinal.toFixed(2));
    return precioFinalRedondeado % 1 === 0 ? `${precioFinalRedondeado.toFixed(2)}` : `${precioFinalRedondeado}`;
  }

  agregarAlCarrito(producto: any): void {

    const token = this.storageService.getToken();

    if (token !== null) {

      producto.cantidad_seleccionada = 1; // o la cantidad deseada
      this.carrito.producto = [producto]; // Enviar solo el producto a agregar
  
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

  resetearFiltro(): void {
    this.listarProductos();
    this.precioHasta = null;
    this.precioDesde = null
    this.selectedColors = [];
    this.predefinedColors.forEach(color => color.selected = false);
    this.selectedCategories = [];
    this.showDescuentoOnly = false;
    this.showNoDescuentoOnly = false;
    this.filterLentesSol = false;
    this.filterBifocales = false;
    this.filterLuz = false;
    this.filterTransitions = false;
    this.applyFilters();

  }

  toggleColorFilter(color: string): void {
    const index = this.selectedColors.indexOf(color);
    if (index === -1) {
      this.selectedColors.push(color);
    } else {
      this.selectedColors.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleDescuentoFilter(): void {
    if (this.showDescuentoOnly) {
      this.showNoDescuentoOnly = false;
    }
    this.applyFilters();
  }

  toggleNoDescuentoFilter(): void {
    if (this.showNoDescuentoOnly) {
      this.showDescuentoOnly = false;
    }
    this.applyFilters();
  }

  toggleCategoryFilter(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index === -1) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.applyFilters();
  }

  applyFilters(): Producto[] {
    return this.filteredProductos = this.listaProductos.filter(producto => {
      const dentroDeRangoDesde = this.precioDesde != null ? this.calcularPD(producto.precio, producto.descuento) >= this.precioDesde : true;
      const dentroDeRangoHasta = this.precioHasta != null ? this.calcularPD(producto.precio, producto.descuento) <= this.precioHasta : true;
      const matchesColor = this.selectedColors.length > 0 ? this.selectedColors.includes(producto.caracteristicas['color']) : true;
      const matchesDescuento = this.showDescuentoOnly ? producto.descuento > 0 : true;
      const matchesNoDescuento = this.showNoDescuentoOnly ? producto.descuento === 0 : true;
      const matchesCategory = this.selectedCategories.length > 0 ? this.selectedCategories.includes(producto.categoria) : true;
      return dentroDeRangoDesde && dentroDeRangoHasta && matchesColor && matchesDescuento && matchesNoDescuento && matchesCategory;
    });
  }

  validateInput(event: any): void {
    const input = event.target;
    if (input.value.length > 3) {
      input.value = input.value.slice(0, 3);
    }
  }
}
