export interface ComprobanteDetalleVentaModels {
    id_comprobante_detalle: string;
    carrito: Carrito;
    fecha_venta: string;
    subtotal: number;
    descuento: number; // Campo adicional
    iva: number;
    total: number;
  }
  
  export interface Carrito {
    id_carrito: string;
    usuario: Usuario;
    producto: Producto[];
    estado: string;
  }
  
  export interface Usuario {
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
    estado: string;
  }
  
  export interface Producto {
    codUnico: string;
    nombre: string;
    precio: number;
    descuento: number;
    categoria: string;
    imagenes: string[];
    caracteristicas: { [key: string]: string };
    descripcion: string;
    genero: string;
    oferta: boolean;
    stock: number;
    estado: string;
    cantidad_seleccionada: number;
  }
  