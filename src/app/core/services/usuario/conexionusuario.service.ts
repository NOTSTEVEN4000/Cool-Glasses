import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from '../conexion-api/api';
import { Usuario } from '../../models/usuario.interface';
import { AuthServiceService } from '../seguridad/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ConexionusuarioService {

  @Output() disparadorUsuario: EventEmitter<any> = new EventEmitter();
  private url = API_URL + 'usuarios';
  private _refresh$ = new Subject<void>();
  private enviarUpdate = new BehaviorSubject<any>(''); 
  datos$ = this.enviarUpdate.asObservable(); 

  constructor(private http: HttpClient, private authService: AuthServiceService) { }

  enviarDatos(datos: Usuario) {
    this.enviarUpdate.next(datos);
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }

  getUsuario(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(this.url + '/' + id);
  }

  addUsuario(usuario: Usuario, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('usuario', new Blob([JSON.stringify(usuario)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file);
    }
    return this.http.post(this.url + '/register', formData, {
      headers: this.createHeaders().delete('Content-Type') // Remove 'Content-Type' header for multipart request
    }).pipe(
      tap(() => {
        this._refresh$.next();
      })
    );
  }

  deleteUsuario(id: string): Observable<any> {
    return this.http.delete(this.url + '/' + id).pipe(
      tap(() => {
        this._refresh$.next();
      })
    );
  }

  editUsuario(id: string, usuario: Usuario, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('usuario', new Blob([JSON.stringify(usuario)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file);
    }
    return this.http.put(`${this.url}/${id}`, formData) // Remove 'Content-Type' header for multipart request
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    );
  }
  

  register(usuario: Usuario, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('usuario', new Blob([JSON.stringify(usuario)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file);
    }
    return this.http.post(`${this.url}/register`, formData, {
      headers: this.createHeaders().delete('Content-Type') // Remove 'Content-Type' header for multipart request
    });
  }

  login(credentials: { correo: string; contrasena: string; }): Observable<any> {
    return this.http.post(`${this.url}/login`, credentials).pipe(
      tap(async (response: any) => {
        console.log('Response from server:', response);
        if (response && response.token) {
          await this.authService.setToken(response.token);
          console.log('Token saved:', response.token);
        }
      })
    );
  }

  checkEmailExists(correo: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/check-email?correo=${correo}`);
  }

  private createHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  get refresh$() {
    return this._refresh$;
  }
}

console.log("Conexion de Usuarios!");
export { Usuario };
