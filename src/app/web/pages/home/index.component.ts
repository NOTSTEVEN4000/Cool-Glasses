import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Typed from 'typed.js';
import { HeaderDinamicoComponent } from "../../components/header-dinamico/header-dinamico.component";
import { CartasDinamicasHomeComponent } from "../../components/cartas-dinamicas-home/cartas-dinamicas-home.component";
import { GaleriaImagenesHomeComponent } from "../../components/galeria-imagenes-home/galeria-imagenes-home.component";
import { TarjetasHomeComponent } from "../../components/tarjetas-home/tarjetas-home.component";
import { LogoFlotanteComponent } from "../../components/logo-flotante/logo-flotante.component";
import { SeccionMarcasComponent } from "../../components/seccion-marcas/seccion-marcas.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { SliderImagenesComponent } from "../../components/slider-imagenes/slider-imagenes.component";
import { Slider3DComponent } from "../../components/slider3-d/slider3-d.component";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterModule, HeaderDinamicoComponent, CartasDinamicasHomeComponent, GaleriaImagenesHomeComponent, TarjetasHomeComponent, LogoFlotanteComponent, SeccionMarcasComponent, FooterComponent, NavBarComponent, SliderImagenesComponent, Slider3DComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {
  private router = inject(Router);

  ngOnInit(): void {}

  //**** Método de redireccionamiento, donde le pasamos un parametro de tipo string la ruta inicial a donde queremos llegar****/
  //** Funcional para direccionamiento entre componentes de las pages **//
  redirectAndScrollToTop(route: string) {
    this.router.navigate([route]).then(() => {
      window.scrollTo(0, 0);
    });
  }
}