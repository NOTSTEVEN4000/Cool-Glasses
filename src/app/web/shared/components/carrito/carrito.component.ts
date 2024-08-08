import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  Carrito,
  CarritoService,
} from '../../../../core/services/carrito/carrito.service';
import {
  ComprobanteDetalleVentaModels,
  ComprobanteService,
} from '../../../../core/services/comprobante/comprobante.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../../core/services/seguridad/auth-service.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeSidebarEvent = new EventEmitter<void>();
  private router = inject(Router);

  cartItems: CartItem[] = [];
  descuento: number = 0;
  subtotal: number = 0;
  subtotaloriginal: number = 0;
  iva: number = 0;
  total: number = 0;
  userEmail: string = ''; // Variable para almacenar el correo electrónico del usuario
  private subscription: Subscription = new Subscription();

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

  constructor(
    private storageService: AuthServiceService,
    private carritoService: CarritoService,
    private comprobanteService: ComprobanteService
  ) { }

  ngOnInit() {
    const token = this.storageService.getToken();

    if (token !== null) {
      const tokenD = this.storageService.decodeToken(token!);
      console.log('Token Desincriptado:', tokenD);
      this.userEmail = tokenD.correo;
      this.carrito.usuario.nombre = tokenD.nombre;
      this.carrito.usuario.apellido = tokenD.apellido;
      this.carrito.usuario.correo = tokenD.correo;
      this.carrito.usuario.rol = tokenD.rol;
      this.carrito.usuario.estado = tokenD.estado;
    }

    this.loadCarrito(this.userEmail);
    this.subscription.add(
      this.carritoService.carritoUpdates$.subscribe(() => {
        this.loadCarrito(this.userEmail);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadCarrito(correo: string) {
    this.carritoService.getCarritoByCorreo(correo).subscribe(
      (carrito: Carrito) => {
        this.cartItems = carrito.producto.map((producto) => ({
          name: producto.nombre,
          price: this.calcularPD(producto.precio, producto.descuento),
          priceoriginal: producto.precio,
          quantity: producto.cantidad_seleccionada,
          originalQuantity: producto.cantidad_seleccionada, // Store original quantity
          stock: producto.stock, // Store available stock
          image: producto.imagenes[0],
          descuento: producto.descuento,
          codUnico: producto.codUnico, // Añadido para identificar el producto
          quantityChanged: false, // Añadido para rastrear cambios en la cantidad
        }));
        this.calculateTotals();
      },
      (error) => {
        console.error('Error loading carrito:', error);
        // Handle error appropriately
      }
    );
  }

  calcularPD(precio: number, descuento: number): number {
    const descuentoAplicado = precio * (descuento / 100);
    const precioFinal = precio - descuentoAplicado;
    return parseFloat(precioFinal.toFixed(2));
  }

  calculateTotals() {
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    this.subtotaloriginal = this.cartItems.reduce(
      (sum, item) => sum + item.priceoriginal * item.quantity,
      0
    );
    this.descuento = this.cartItems.reduce(
      (sum, item) => sum + (item.priceoriginal - item.price) * item.quantity,
      0
    );
    this.iva = parseFloat((this.subtotal * 0.15).toFixed(2));
    this.total = parseFloat((this.subtotal + this.iva).toFixed(2));
  }

  closeSidebar() {
    this.isOpen = false;
    this.closeSidebarEvent.emit();
  }

  removeItem(index: number) {
    const item = this.cartItems[index];
    this.carritoService
      .removeProductFromCarrito(this.userEmail, item.codUnico)
      .subscribe(
        () => {
          this.cartItems.splice(index, 1);
          this.calculateTotals();
        },
        (error) => {
          console.error('Error removing product from carrito:', error);
          // Handle error appropriately
        }
      );
  }

  increaseQuantity(index: number) {
    const item = this.cartItems[index];
    if (item.quantity < item.stock) {
      item.quantity++;
      item.quantityChanged = true;
      this.calculateTotals();
    } else {
      Swal.fire({
        title: 'Stock limitado',
        text:
          'No puedes añadir más de este producto. Stock disponible: ' +
          item.stock,
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'swal-button--confirm',
        },
      });
    }
  }

  decreaseQuantity(index: number) {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      this.cartItems[index].quantityChanged = true;

      this.calculateTotals();
    }
  }

  updateQuantity(index: number) {
    const item = this.cartItems[index];
    const originalQuantity = item.originalQuantity; // Save the original quantity

    // Create the correct object structure
    const productoParaAgregar = {
      codUnico: item.codUnico,
      nombre: item.name,
      precio: item.priceoriginal,
      descuento: item.descuento,
      categoria: '',
      imagenes: [item.image],
      caracteristicas: {},
      descripcion: '',
      genero: '',
      oferta: false,
      stock: item.stock, // Include the stock value
      estado: 'activo',
      cantidad_seleccionada: item.quantity,
    };

    this.carrito.producto = [productoParaAgregar];

    this.carritoService.updateProductQuantity(this.carrito).subscribe(
      (res) => {
        Swal.fire({
          title: 'Cantidad actualizada',
          text: 'La cantidad del producto se ha actualizado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-button--confirm',
          },
        });
        item.originalQuantity = item.quantity; // Update the original quantity after successful update
        item.quantityChanged = false;
        this.calculateTotals();
      },
      (err) => {
        console.error(
          'Error al actualizar la cantidad del producto en el carrito',
          err
        );
        if (err.error === 'Cantidad seleccionada supera el stock disponible') {
          Swal.fire({
            title: 'Error',
            text: 'Cantidad seleccionada supera el stock disponible.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'swal-button--confirm',
            },
          });
          item.quantity = originalQuantity; // Revert to the original quantity
          item.quantityChanged = false; // Reset quantityChanged
          this.calculateTotals();
        } else if (
          err.error === 'Producto no encontrado en el carrito' ||
          err.error === 'Carrito no encontrado para el correo proporcionado'
        ) {
          Swal.fire({
            title: 'Error',
            text: err.error,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al actualizar la cantidad del producto en el carrito.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'swal-button--confirm',
            },
          });
        }
      }
    );
  }

  completePurchase() {
    const token = this.storageService.getToken();

    if (token !== null) {
      if (this.cartItems.length > 0) {
        this.carritoService.getCarritoByCorreo(this.userEmail).subscribe(
          (carrito: Carrito) => {
            const comprobante: ComprobanteDetalleVentaModels = {
              id_comprobante_detalle: '', // Será generado por el backend
              carrito: carrito,
              fecha_venta: new Date().toISOString(),
              subtotal: this.subtotaloriginal,
              descuento: this.descuento,
              iva: this.iva,
              total: this.total,
            };

            this.comprobanteService.addComprobante(comprobante).subscribe(
              (res) => {
                Swal.fire({
                  title: 'Compra completada',
                  text: 'Tu compra se ha realizado con éxito.',
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                  customClass: {
                    confirmButton: 'swal-button--confirm',
                  },
                }).then(() => {
                  window.location.reload(); // Recargar la página después de confirmar la alerta
                });
                this.cartItems = []; // Vaciar el carrito después de la compra
                this.calculateTotals(); // Recalcular los totales
                this.closeSidebar(); // Cerrar el sidebar del carrito
              },
              (err) => {
                console.error('Error al completar la compra:', err);
                Swal.fire({
                  title: 'Error',
                  text: 'Hubo un problema al completar la compra.',
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                  customClass: {
                    confirmButton: 'swal-button--confirm',
                  },
                });
              }
            );
          },
          (error) => {
            console.error('Error loading carrito:', error);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al cargar el carrito.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              customClass: {
                confirmButton: 'swal-button--confirm',
              },
            });
          }
        );
      } else {
        Swal.fire({
          title: 'No se pudo Generar su Compra!',
          text: 'Añada un producto al carrito',
          icon: 'info',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-button--confirm',
          },
        });
      }
    } else {
      Swal.fire({
        title: 'No se pudo Generar su Compra!',
        text: 'Inicie sesión para continuar',
        icon: 'info',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'swal-button--confirm',
        },
      });
    }
  }

  //**** Método de redireccionamiento, donde le pasamos un parametro de tipo string la ruta inicial a donde queremos llegar****/
  //** Funcional para direccionamiento entre componentes de las pages **//
  redirectAndScrollToTop(route: string) {
    this.router.navigate([route]).then(() => {
      window.location.reload();
      window.scrollTo(0, 0);
    });
  }
}

interface CartItem {
  name: string;
  price: number;
  priceoriginal: number;
  quantity: number;
  originalQuantity: number; // Store the original quantity
  stock: number; // Add stock property
  image: string;
  descuento: number;
  codUnico: string; // Añadido para identificar el producto
  quantityChanged: boolean; // Añadido para rastrear cambios en la cantidad
}
