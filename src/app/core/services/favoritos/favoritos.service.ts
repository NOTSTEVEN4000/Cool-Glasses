import { EventEmitter, Injectable, Output } from '@angular/core';
import { Favorito } from '../../models/favorito.interface';
import { API_URL } from '../conexion-api/api';
import { BehaviorSubject, catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FavoritoService {
  @Output() disparadorFavorito: EventEmitter<any> = new EventEmitter();
  private url = API_URL + 'favoritos';
  private _refresh$ = new Subject<void>();
  private favoritoUpdate = new BehaviorSubject<void>(undefined);

  private enviarUpdate = new BehaviorSubject<any>('');
  datos$ = this.enviarUpdate.asObservable();
  enviarDatos(datos: Favorito) {
    this.enviarUpdate.next(datos);
  }

  constructor(private http: HttpClient) { }

  getFavoritos(): Observable<Favorito[]> {
    return this.http.get<Favorito[]>(this.url);
  }

  getFavorito(id: string): Observable<Favorito> {
    return this.http.get<Favorito>(this.url + '/' + id);
  }

  addFavorito(favorito: any): Observable<any> {
    return this.http.post(this.url, favorito)
      .pipe(
        tap(() => {
          this._refresh$.next();
          this.emitirActualizacionFavorito(); // Emitir evento de actualización
        }),
        catchError((error: any) => {
          return throwError(() => new Error('Error al añadir producto a favoritos'));
        })
      );
  }

  deleteFavorito(id: string): Observable<any> {
    return this.http.delete(this.url + '/' + id);
  }

  deleteProductoFromFavorito(correo: string, codUnico: string): Observable<any> {
    return this.http.delete(`${this.url}/correo/${correo}/producto/${codUnico}`)
      .pipe(
        tap(() => {
          this._refresh$.next();
          this.emitirActualizacionFavorito(); // Emitir evento de actualización
        }),
        catchError((error: any) => {
          return throwError(() => new Error('Error al eliminar el producto de los favoritos'));
        })
      );
  }

  editFavorito(id: string, favorito: Favorito): Observable<any> {
    return this.http.put(this.url + '/' + id, favorito)
      .pipe(
        tap(() => {
          this._refresh$.next();
          this.emitirActualizacionFavorito(); // Emitir evento de actualización
        })
      );
  }

  getFavoritoByCorreo(correo: string): Observable<Favorito> {
    return this.http.get<Favorito>(`${this.url}/correo/${correo}`);
  }

  get refresh$() {
    return this._refresh$;
  }

  get favoritoUpdates$(): Observable<void> {
    return this.favoritoUpdate.asObservable();
  }

  emitirActualizacionFavorito() {
    this.favoritoUpdate.next();
  }
}

/* Es una declaración de depuración. */
console.log("Conexion de Favoritos!");
export { Favorito };
