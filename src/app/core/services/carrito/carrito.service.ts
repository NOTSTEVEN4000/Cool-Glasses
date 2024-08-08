import { EventEmitter, Injectable, Output } from '@angular/core';
import { Carrito } from '../../models/carrito.interface';
import { API_URL } from '../conexion-api/api';
import { BehaviorSubject, catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  @Output() disparadorCarrito: EventEmitter<any> = new EventEmitter();
  private url = API_URL + 'carritos';
  private _refresh$ = new Subject<void>();
  private carritoUpdate = new BehaviorSubject<void>(undefined);

  private enviarUpdate = new BehaviorSubject<any>('');
  datos$ = this.enviarUpdate.asObservable();
  enviarDatos(datos: Carrito) {
    this.enviarUpdate.next(datos);
  }

  constructor(private http: HttpClient) { }

  getCarritos(): Observable<Carrito[]> {
    return this.http.get<Carrito[]>(this.url);
  }

  getCarrito(id: string): Observable<Carrito> {
    return this.http.get<Carrito>(this.url + '/' + id);
  }

  addCarrito(carrito: Carrito): Observable<any> {
    return this.http.post(this.url, carrito)
      .pipe(
        tap(() => {
          this._refresh$.next();
          this.emitirActualizacionCarrito(); // Emitir evento de actualización
        }),
        catchError((error: any) => {
          if (error.status === 409) {
            // Conflicto, el producto ya existe en el carrito
            return throwError(() => new Error('Producto ya existe en el carrito'));
          } else {
            return throwError(() => new Error('Error al añadir producto al carrito'));
          }
        })
      );
  }
  

  addOrUpdateCarrito(carrito: Carrito): Observable<any> {
    return this.http.post(`${this.url}/addOrUpdate`, carrito)
      .pipe(
        tap(() => {
          this._refresh$.next();
          this.emitirActualizacionCarrito(); // Emitir evento de actualización
        })
      );
  }

  deleteCarrito(id: string): Observable<any> {
    return this.http.delete(this.url + '/' + id);
  }

  editCarrito(id: string, carrito: Carrito): Observable<any> {
    return this.http.put(this.url + '/' + id, carrito)
      .pipe(
        tap(() => {
          this._refresh$.next();
          this.emitirActualizacionCarrito(); // Emitir evento de actualización
        })
      );
  }

  getCarritoByCorreo(correo: string): Observable<Carrito> {
    return this.http.get<Carrito>(`${this.url}/correo/${correo}`);
  }

  removeProductFromCarrito(correo: string, codUnico: string): Observable<any> {
    return this.http.delete(`${this.url}/removeProduct/${correo}/${codUnico}`)
      .pipe(
        tap(() => {
          this._refresh$.next();
          this.emitirActualizacionCarrito(); // Emitir evento de actualización
        })
      );
  }

  updateProductQuantity(carrito: Carrito): Observable<any> {
    return this.http.put(`${this.url}/updateQuantity`, carrito)
      .pipe(
        tap(() => {
          this._refresh$.next();
          this.emitirActualizacionCarrito(); // Emitir evento de actualización
        })
      );
  }

  get refresh$() {
    return this._refresh$;
  }

  get carritoUpdates$(): Observable<void> {
    return this.carritoUpdate.asObservable();
  }

  emitirActualizacionCarrito() {
    this.carritoUpdate.next();
  }
}

/* Es una declaración de depuración. */
console.log("Conexion de Carritos!");
export { Carrito };
