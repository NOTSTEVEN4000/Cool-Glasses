import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../conexion-api/api';

@Injectable({
  providedIn: 'root'
})
export class CambiopasswordService {
  private url = API_URL + 'password';

  constructor(private http: HttpClient) { }

  recuperarContrasena(correo: string): Observable<any> {
    return this.http.post(`${this.url}/recuperar`, { correo })
  }

  cambiarContrasena(correo: string, codigoRecuperacion: string, nuevaContrasena: string): Observable<any> {
    return this.http.post(`${this.url}/cambiar`, { correo, codigoRecuperacion, nuevaContrasena })
      .pipe(
        catchError((error: any) => {
          return throwError(() => new Error('Error al cambiar la contraseña'));
        })
      );
  }

  validarCodigo(correo: string, codigoRecuperacion: string): Observable<any> {
    return this.http.post(`${this.url}/validar-codigo`, { correo, codigoRecuperacion })
      .pipe(
        catchError((error: any) => {
          return throwError(() => new Error('Error al validar el código de recuperación'));
        })
      );
  }
}
