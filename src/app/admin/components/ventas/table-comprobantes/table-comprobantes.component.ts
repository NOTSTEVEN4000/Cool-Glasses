import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ConexionusuarioService } from '../../../../core/services/usuario/conexionusuario.service';
import { Usuario } from '../../../../core/models/usuario.interface';
import { ComprobanteDetalleVentaModels, ComprobanteService } from '../../../../core/services/comprobante/comprobante.service';

@Component({
  selector: 'app-table-comprobantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-comprobantes.component.html',
  styleUrl: './table-comprobantes.component.css'
})
export class TableComprobantesComponent implements OnInit {
  subscription: Subscription = new Subscription();
  private usuarioService = inject(ConexionusuarioService);
  private comprobanteService = inject(ComprobanteService);

  listaUsuarios: Usuario[] = [];
  showComprobanteModal = false;
  selectedUsuario: Usuario | null = null;
  comprobantes: ComprobanteDetalleVentaModels[] = [];
  expandedComprobante: number | null = null;

  ngOnInit(): void {
    this.listarUsuarios();
    this.subscription.add(
      this.usuarioService.refresh$.subscribe(() => {
        this.listarUsuarios();
      })
    );
  }

  listarUsuarios(): void {
    this.subscription.add(
      this.usuarioService.getUsuarios().subscribe(
        (res: Usuario[]) => {
          this.listaUsuarios = res;
        },
        (err) => {
          console.error('Error al listar usuarios', err);
        }
      )
    );
  }

  viewComprobantes(usuario: Usuario): void {
    this.selectedUsuario = usuario;
    this.subscription.add(
      this.comprobanteService.getComprobanteByCorreo(usuario.correo).subscribe(
        (res: ComprobanteDetalleVentaModels[]) => {
          this.comprobantes = res;
          this.showComprobanteModal = true;
        },
        (err) => {
          console.error('Error al obtener comprobantes', err);
        }
      )
    );
  }

  closeComprobanteModal(): void {
    this.showComprobanteModal = false;
    this.selectedUsuario = null;
    this.comprobantes = [];
  }

  toggleComprobante(index: number): void {
    if (this.expandedComprobante === index) {
      this.expandedComprobante = null;
    } else {
      this.expandedComprobante = index;
    }
  }
}
