import { Routes } from "@angular/router";
import { IndexComponent } from "./home/index.component";
import { HombresComponent } from "./hombres/hombres.component";
import { MujeresComponent } from "./mujeres/mujeres.component";
import { NionosComponent } from "./ninos/nionos.component";
import { AcercadeComponent } from "./acercade/acercade.component";
import { DetalleHombreComponent } from "./detalles-lentes/detalle-hombre/detalle-hombre.component";
import { DetalleMujeresComponent } from "./detalles-lentes/detalle-mujeres/detalle-mujeres.component";
import { DetalleNinosComponent } from "./detalles-lentes/detalle-ninos/detalle-ninos.component";
import { FavoriteComponent } from "./favorite/favorite.component";
import { SeccionTeamComponent } from "../components/seccion-team/seccion-team.component";
import { PageBuscadorProductoComponent } from "./page-buscador-producto/page-buscador-producto.component";
import { ResultadosBusquedaComponent } from "./resultados-busqueda/resultados-busqueda.component";
import { seguriRutasGuard } from "../../auth/SeguriRutas/seguri-rutas.guard";
import { ComprobantesComponent } from "./comprobantes/comprobantes.component";

export const PAGES_ROUTES: Routes = [
    { path: 'inicio', component: IndexComponent },
    { path: 'hombres', component: HombresComponent },
    { path: 'mujeres', component: MujeresComponent },
    { path: 'ninos', component: NionosComponent },
    { path: 'acercade', component: AcercadeComponent },
    { path: 'producto/hombres/:codUnico', component: DetalleHombreComponent  },
    { path: 'producto/mujeres/:codUnico', component: DetalleMujeresComponent },
    { path: 'producto/ninos/:codUnico', component: DetalleNinosComponent },
    { path: 'favorito', component: FavoriteComponent , canActivate: [seguriRutasGuard]},
    { path: 'team-developers', component: SeccionTeamComponent },
    { path: 'producto/:codUnico', component: PageBuscadorProductoComponent}, 
    { path: 'resultados', component: ResultadosBusquedaComponent }, 
    { path: 'comprobante', component: ComprobantesComponent }, 
];
