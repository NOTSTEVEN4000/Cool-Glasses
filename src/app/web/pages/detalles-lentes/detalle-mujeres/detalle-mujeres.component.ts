import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Producto } from '../../../../core/models/producto.interface';
import { ConexProductosService } from '../../../../core/services/producto/product.service';
import { CarritoService } from '../../../../core/services/carrito/carrito.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Carrito } from '../../../../core/models/carrito.interface';
import { NavBarComponent } from "../../../shared/components/nav-bar/nav-bar.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { Favorito, FavoritoService } from '../../../../core/services/favoritos/favoritos.service';
import { AuthServiceService } from '../../../../core/services/seguridad/auth-service.service';
import { AngularxQrcodeStandaloneModule } from '../../../shared/components/angularx-qrcode.module';

@Component({
  selector: 'app-detalle-mujeres',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NavBarComponent, FooterComponent,AngularxQrcodeStandaloneModule],
  templateUrl: './detalle-mujeres.component.html',
  styleUrls: ['./detalle-mujeres.component.css']
})
export class DetalleMujeresComponent implements OnInit {
  mainImage!: string;
  thumbnails!: string[];
  quantity: number = 1;
  mostrarQR: boolean = false;
  route: ActivatedRoute = inject(ActivatedRoute);
  private ConexProductosService = inject(ConexProductosService);
  private CarritoService = inject(CarritoService);
  private FavoritoService = inject(FavoritoService);
  private storageService = inject(AuthServiceService);
  
  producto: Producto | undefined;
  predefinedColors: { name: string, rgb: string }[] = [
    { name: 'Negro', rgb: '#000000' },
    { name: 'Gris', rgb: '#808080' },
    { name: 'Azul', rgb: '#0000FF' },
    { name: 'Rojo', rgb: '#FF0000' },
    { name: 'Verde', rgb: '#008000' },
    { name: 'Amarillo', rgb: '#FFFF00' },
    { name: 'Naranja', rgb: '#FFA500' },
    { name: 'Rosa', rgb: '#FFC0CB' },
    { name: 'Morado', rgb: '#800080' },
    { name: 'Marrón', rgb: '#A52A2A' }
  ];

  carrito: Carrito = {
    id_carrito: '',
    usuario: {
      nombre: '',
      apellido: '',
      correo: '',
      rol: '',
      estado: '',
    },
    producto: [],
    estado: 'pendiente',
  };

  constructor() {}

  ngOnInit() {
    const codigo = this.route.snapshot.params['codUnico'];
    this.ConexProductosService.getProductoByCodUnico(codigo).subscribe(
      (producto: Producto) => {
        this.producto = producto;
        if (producto.imagenes && producto.imagenes.length > 0) {
          this.thumbnails = producto.imagenes;
          this.mainImage = this.thumbnails[0];
        }
      },
      (error) => {
        console.error('Error al obtener el producto', error);
      }
    );
  }

  changeImage(src: string) {
    this.mainImage = src;
  }

  incrementar() {
    if (this.producto && this.quantity < this.producto.stock) {
      this.quantity++;
    }
  }

  decrementar() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  calcularPD(precio: number, descuento: number): string {
    const descuentoAplicado = precio * (descuento / 100);
    const precioFinal = precio - descuentoAplicado;
    const precioFinalRedondeado = parseFloat(precioFinal.toFixed(2));
    return precioFinalRedondeado % 1 === 0 ? `${precioFinalRedondeado.toFixed(2)}` : `${precioFinalRedondeado}`;
  }

  getProductColorRGB(colorName: string): string | undefined {
    const color = this.predefinedColors.find(c => c.name.toLowerCase() === colorName.toLowerCase());
    return color ? color.rgb : undefined;
  }

  agregarAlCarrito() {

    const token = this.storageService.getToken();

    if (token !== null) {

      const tokenD = this.storageService.decodeToken(token!);
      console.log('Token Desincriptado:', tokenD);
      this.carrito.usuario.nombre = tokenD.nombre;
      this.carrito.usuario.apellido = tokenD.apellido;
      this.carrito.usuario.correo = tokenD.correo;
      this.carrito.usuario.rol = tokenD.rol;
      this.carrito.usuario.estado = tokenD.estado;

      if (this.producto) {
        const productoParaAgregar = { ...this.producto, cantidad_seleccionada: this.quantity };
  
        this.carrito.producto = [productoParaAgregar];
        
        this.CarritoService.addOrUpdateCarrito(this.carrito).subscribe(
          res => {
            Swal.fire({
              title: 'Producto añadido',
              text: 'El producto se ha añadido al carrito correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            this.quantity=1;
          },
          err => {
            console.error('Error al añadir producto al carrito', err);
            if (err.error === 'Cantidad seleccionada supera el stock disponible') {
              Swal.fire({
                title: 'Error',
                text: 'Cantidad seleccionada supera el stock disponible.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al añadir el producto al carrito.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          }
        );
      }
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
  agregarAFavoritos(): void {
    const token = this.storageService.getToken();
    if (token !== null) {
      const tokenD = this.storageService.decodeToken(token!);
      this.carrito.usuario.nombre = tokenD.nombre;
      this.carrito.usuario.apellido = tokenD.apellido;
      this.carrito.usuario.correo = tokenD.correo;
      this.carrito.usuario.rol = tokenD.rol;
      this.carrito.usuario.estado = tokenD.estado;

      if (this.producto) {
        const { id, codUnico, nombre, precio, descuento, categoria, imagenes, caracteristicas, descripcion, genero, oferta, stock, estado } = this.producto;
  
        // Non-null assertion for id
        const cleanProducto: Producto = {
          id: id!,
          codUnico,
          nombre,
          precio,
          descuento,
          categoria,
          imagenes,
          caracteristicas,
          descripcion,
          genero,
          oferta,
          stock,
          estado,
        };
  
        const nuevoFavorito: Favorito = {
          idFavorito: '',
          usuario: this.carrito.usuario,
          producto: [cleanProducto]
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
      }

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
  toggleQR(): void {
    if (this.producto && this.producto.codUnico) {
      this.mostrarQR = !this.mostrarQR;
    }
  }
}
