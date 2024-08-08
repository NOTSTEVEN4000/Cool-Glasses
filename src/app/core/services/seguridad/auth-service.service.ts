import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor() {}

  setToken(token: string) {
    localStorage.setItem('auth-token', token);
    console.log('Token set in storage:', token); // Log del token guardado
  }

  getToken() {
    const token = localStorage.getItem('auth-token');
    console.log('Token retrieved from storage:', token); // Log del token recuperado
    return token;
  }

  removeToken() {
    localStorage.removeItem('auth-token');
    console.log('Token removed from storage'); // Log del token eliminado
  }
  
  setUserRole(role: 'administrador' | 'cliente') {
    localStorage.setItem('user-role', role);
    console.log('User role set in storage:', role); // Log del rol guardado
  }

  getUserRole(): 'administrador' | 'cliente' | null {
    const role = localStorage.getItem('user-role') as 'administrador' | 'cliente' | null;
    console.log('User role retrieved from storage:', role); // Log del rol recuperado
    return role;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token; // Verifica si el token existe
  }

  logout() {
    this.removeToken();
    localStorage.removeItem('user-role');
    console.log('User logged out'); // Log del cierre de sesión
  }

  decodeToken(token: string) {
    try {
      const decoded = atob(token);
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }
}
