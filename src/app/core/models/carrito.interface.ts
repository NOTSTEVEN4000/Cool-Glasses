export interface Usuario {
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
    estado: string;
  }
  
  export interface ProductoC {
    codUnico: string;
    nombre: string;
    precio: number;
    descuento: number; // Campo adicional
    categoria: string;
    imagenes: string[];
    caracteristicas: { [key: string]: string };
    descripcion: string; // Campo adicional
    genero: string;
    oferta: boolean;
    stock: number;
    estado: string;
    cantidad_seleccionada: number;
  }
  
  export interface Carrito {
    id_carrito: string;
    usuario: Usuario;
    producto: ProductoC[];
    estado: string;
  }
  