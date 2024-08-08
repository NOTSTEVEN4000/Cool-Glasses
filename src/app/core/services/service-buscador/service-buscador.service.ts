import { Injectable } from '@angular/core';
import { Producto } from '../producto/product.service';
import { Usuario } from '../usuario/conexionusuario.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceBuscadorService {
  constructor() { }

  filterProducts(listaProductos: Producto[], searchTerm: string): Producto[] {
    if (!searchTerm) {
      return listaProductos;
    }
    const term = searchTerm.toLowerCase();
    return listaProductos.filter(producto =>
      producto.codUnico.toLowerCase().includes(term) ||
      producto.nombre.toLowerCase().includes(term) ||
      producto.categoria.toLowerCase().includes(term) ||
      producto.genero.toLowerCase().includes(term)
    );
  }

  getAutocompleteSuggestions(listaProductos: Producto[], searchTerm: string): string[] {
    const term = searchTerm.toLowerCase();
    const suggestions = new Set<string>();
    listaProductos.forEach(producto => {
      if (producto.codUnico.toLowerCase().includes(term)) {
        suggestions.add(producto.codUnico);
      }
      if (producto.nombre.toLowerCase().includes(term)) {
        suggestions.add(producto.nombre);
      }
      if (producto.categoria.toLowerCase().includes(term)) {
        suggestions.add(producto.categoria);
      }
      if (producto.genero.toLowerCase().includes(term)) {
        suggestions.add(producto.genero);
      }
    });
    return Array.from(suggestions).slice(0, 5);
  }

  filterUsers(usuarios: Usuario[], searchTerm: string): Usuario[] {
    const term = searchTerm.toLowerCase();
    return usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(term) ||
      usuario.apellido.toLowerCase().includes(term) ||
      usuario.correo.toLowerCase().includes(term) ||
      usuario.estado.toLowerCase().includes(term) ||
      usuario.ciudad.toLowerCase().includes(term) ||
      usuario.provincia.toLowerCase().includes(term) ||
      usuario.pais.toLowerCase().includes(term) ||
      usuario.telefono.toLowerCase().includes(term)
    );
  }

  getUserAutocompleteSuggestions(usuarios: Usuario[], searchTerm: string): string[] {
    const term = searchTerm.toLowerCase();
    const suggestions = new Set<string>();
    usuarios.forEach(usuarios => {
      if (usuarios.nombre.toLowerCase().includes(term)) {
        suggestions.add(usuarios.nombre);
      }
      if (usuarios.apellido.toLowerCase().includes(term)) {
        suggestions.add(usuarios.apellido);
      }
      if (usuarios.correo.toLowerCase().includes(term)) {
        suggestions.add(usuarios.correo);
      }
      if (usuarios.telefono.toLowerCase().includes(term)) {
        suggestions.add(usuarios.telefono);
      }
      if (usuarios.pais.toLowerCase().includes(term)) {
        suggestions.add(usuarios.pais);
      }
      if (usuarios.pais.toLowerCase().includes(term)) {
        suggestions.add(usuarios.pais);
      }
      if (usuarios.provincia.toLowerCase().includes(term)) {
        suggestions.add(usuarios.provincia);
      }
    });
    return Array.from(suggestions).slice(0, 5);
  }
}
