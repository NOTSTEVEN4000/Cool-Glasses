import { EventEmitter, Injectable, Output } from '@angular/core';
import { API_URL } from '../conexion-api/api';
import { BehaviorSubject, catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ComprobanteDetalleVentaModels } from '../../models/ComprobanteDetalleVentaModels.interface';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService {
  @Output() disparadorComprobante: EventEmitter<any> = new EventEmitter();
  private url = API_URL + 'comprobantedv';
  private _refresh$ = new Subject<void>();
  private comprobanteUpdate = new BehaviorSubject<void>(undefined);

  private enviarUpdate = new BehaviorSubject<any>('');
  datos$ = this.enviarUpdate.asObservable();
  enviarDatos(datos: ComprobanteDetalleVentaModels) {
    this.enviarUpdate.next(datos);
  }

  constructor(private http: HttpClient) { }

  getComprobantes(): Observable<ComprobanteDetalleVentaModels[]> {
    return this.http.get<ComprobanteDetalleVentaModels[]>(this.url);
  }

  getComprobante(id: string): Observable<ComprobanteDetalleVentaModels> {
    return this.http.get<ComprobanteDetalleVentaModels>(this.url + '/' + id);
  }

  addComprobante(comprobante: ComprobanteDetalleVentaModels): Observable<any> {
    return this.http.post(this.url, comprobante)
      .pipe(
        tap(() => {
          this._refresh$.next();
          this.emitirActualizacionComprobante(); // Emitir evento de actualización
        }),
        catchError((error: any) => {
          return throwError(() => new Error('Error al añadir comprobante de venta'));
        })
      );
  }

  deleteComprobante(id: string): Observable<any> {
    return this.http.delete(this.url + '/' + id);
  }

  editComprobante(id: string, comprobante: ComprobanteDetalleVentaModels): Observable<any> {
    return this.http.put(this.url + '/' + id, comprobante)
      .pipe(
        tap(() => {
          this._refresh$.next();
          this.emitirActualizacionComprobante(); // Emitir evento de actualización
        })
      );
  }

  getComprobanteByCorreo(correo: string): Observable<ComprobanteDetalleVentaModels[]> {
    return this.http.get<ComprobanteDetalleVentaModels[]>(`${this.url}/correo/${correo}`);
  }

  get refresh$() {
    return this._refresh$;
  }

  get comprobanteUpdates$(): Observable<void> {
    return this.comprobanteUpdate.asObservable();
  }

  emitirActualizacionComprobante() {
    this.comprobanteUpdate.next();
  }
}

/* Es una declaración de depuración. */
console.log("Conexion de Comprobantes!");
export { ComprobanteDetalleVentaModels };
