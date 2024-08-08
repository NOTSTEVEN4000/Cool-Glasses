export interface Usuario {
  id?: string;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  pais: string;
  rol: string;
  estado: string;
  fotoPerfil?: string; // Añadir campo para la foto de perfil
}