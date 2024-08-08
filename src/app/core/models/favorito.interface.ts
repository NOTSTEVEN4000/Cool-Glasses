export interface Usuario {
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
    estado: string;
  }
  
  export interface Producto {
    id?: string; 
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
  }
  
  export interface Favorito {
    idFavorito: string;
    usuario: Usuario;
    producto: Producto[];
  }
  