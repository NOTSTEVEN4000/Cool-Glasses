import { EventEmitter, Injectable, Output } from '@angular/core';
import { Resena } from '../../models/resena.interface';
import { API_URL } from '../conexion-api/api';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
  @Output() disparadorResena: EventEmitter<any> = new EventEmitter();
  private url = API_URL + 'resenas';
  private _refresh$ = new Subject<void>();
  private resenaUpdate = new BehaviorSubject<void>(undefined);

  private enviarUpdate = new BehaviorSubject<any>('');
  datos$ = this.enviarUpdate.asObservable();
  enviarDatos(datos: Resena) {
    this.enviarUpdate.next(datos);
  }

  constructor(private http: HttpClient) { }

  getResenas(): Observable<Resena[]> {
    return this.http.get<Resena[]>(this.url);
  }

  getResena(id: string): Observable<Resena> {
    return this.http.get<Resena>(this.url + '/' + id);
  }

  addResena(resena: Resena): Observable<any> {
    return this.http.post(this.url, resena)
      .pipe(
        tap(() => {
          this._refresh$.next();
          this.emitirActualizacionResena(); // Emitir evento de actualización
        })
      );
  }

  deleteResena(id: string): Observable<any> {
    return this.http.delete(this.url + '/' + id);
  }

  editResena(id: string, resena: Resena): Observable<any> {
    return this.http.put(this.url + '/' + id, resena)
      .pipe(
        tap(() => {
          this._refresh$.next();
          this.emitirActualizacionResena(); // Emitir evento de actualización
        })
      );
  }

  get refresh$() {
    return this._refresh$;
  }

  get resenaUpdates$(): Observable<void> {
    return this.resenaUpdate.asObservable();
  }

  emitirActualizacionResena() {
    this.resenaUpdate.next();
  }
}

/* Es una declaración de depuración. */
console.log("Conexion de Reseñas!");
export { Resena };
