import { NgIf , NgFor, NgClass} from '@angular/common';
import { Component, inject, Input, NgModule, OnDestroy, OnInit } from '@angular/core';
import { RegistroProductoComponent } from '../registro-producto/registro-producto.component';
import { ModificarProductoComponent } from "../modificar-producto/modificar-producto.component";
import { ConexProductosService, Producto } from '../../../../core/services/producto/product.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceBuscadorService } from '../../../../core/services/service-buscador/service-buscador.service';
import { AngularxQrcodeStandaloneModule } from '../../../../web/shared/components/angularx-qrcode.module';

@Component({
  selector: 'app-tabla-producto',
  standalone: true,
  imports: [NgIf,NgFor,NgClass, RegistroProductoComponent,CommonModule, ModificarProductoComponent, FormsModule,AngularxQrcodeStandaloneModule],
  templateUrl: './tabla-producto.component.html',
  styleUrl: './tabla-producto.component.css'
})
export class TablaProductoComponent implements OnInit,OnDestroy  {
  @Input() data: any; 
  private ConexProductosService = inject(ConexProductosService);

  subscription: Subscription = new Subscription();
  listaProductos: Producto[] = [];
  autocompleteSuggestions: string[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  isRegistrar: boolean = true;
  selectedProduct: any;
  showViewModal = false;
  currentImage: string | undefined;
  largeQRData: string | null = null;

  constructor(private serviceBuscador: ServiceBuscadorService){}

  openRegistrarModal(): void {
    this.isRegistrar = true;
    this.showModal = true;
  }
  
  ngOnInit(): void {
    this.listarProductos();
    this.subscription.add(
      this.ConexProductosService.refresh$.subscribe(() => {
        this.listarProductos();
      })
    );
  }

  openModificarModal(): void {
    this.isRegistrar = false;
    this.showModal = true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeModal(): void {
    this.showModal = false;
  }

  listarProductos(): void {
    this.subscription.add(
      this.ConexProductosService.getProductos().subscribe(
        (res: Producto[]) => {
          this.listaProductos = res;
          console.log(this.listaProductos)
        },
        (err) => {
          console.error('Error al listar productos', err);
         
        }
      )
    );
  }

  eliminarProducto(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ConexProductosService.deleteProducto(id).subscribe(
          () => {
            Swal.fire(
              'Eliminado!',
              'El producto ha sido eliminado.',
              'success'
            );
            this.listarProductos();  
          },
          (err) => {
            Swal.fire(
              'Error!',
              'Hubo un problema al eliminar el producto.',
              'error'
            );
          }
        );
      }
    });
  }

  enviardata(item: any) {
    this.data = item
    this.ConexProductosService.enviarDatos(this.data)
  }

  toggleEstado(producto: any) {
    producto.estado = producto.estado === 'activo' ? 'inactivo' : 'activo';
    this.ConexProductosService.editProducto(producto.id, producto).subscribe(
      () => {
        /*Swal.fire(
          'Estado Actualizado!!',
          'El estado del producto ha sido actualizado.',
          'success'
        );*/
        Swal.fire({
          title: 'Estado Actualizado!!!',
          text: 'El estado del producto ha sido actualizado.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-button--confirm'
          }
        });
      },
      (err) => {
        /*Swal.fire(
          'Error!',
          'Hubo un problema al actualizar el estado del producto.',
          'error'
        );*/

        
        Swal.fire({
          title: 'Error!',
          text: 'Hubo un problema al actualizar el estado del producto.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-button--confirm'
          }
        });
      }
    );
  }

  filterProducts(): void {
    if (!this.searchTerm) {
      this.listaProductos = this.listaProductos;
      this.autocompleteSuggestions = [];
      this.listarProductos();
    } else {
      this.listaProductos = this.serviceBuscador.filterProducts(this.listaProductos, this.searchTerm);
      this.autocompleteSuggestions = this.serviceBuscador.getAutocompleteSuggestions(this.listaProductos, this.searchTerm);
    }
  }

  selectSuggestion(suggestion: string): void {
    this.searchTerm = suggestion;
    this.filterProducts();
  }

  openViewModal(product: Producto): void {
    this.selectedProduct = product;
    this.currentImage = product.imagenes[0];
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedProduct = null;
  }
  
  changeImage(image: string): void {
    this.currentImage = image;
  }
  showLargeQR(data: string): void {
    this.largeQRData = data;
  }

  hideLargeQR(): void {
    this.largeQRData = null;
  }

}
