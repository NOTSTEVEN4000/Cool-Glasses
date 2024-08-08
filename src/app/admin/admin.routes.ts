import { seguriAdminGuard } from "../auth/SeguriAdmin/seguri-admin.guard";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { PageComprobantesComponent } from "./pages/page-comprobantes/page-comprobantes.component";
import { PageMiperfilUserComponent } from "./pages/page-miperfil-user/page-miperfil-user.component";
import { PageProductoComponent } from "./pages/page-producto/page-producto.component";
import { PageResenaComponent } from "./pages/page-resena/page-resena.component";
import { PageUsuariosComponent } from "./pages/page-usuarios/page-usuarios.component";
import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
    {path: 'inicio', component: DashboardComponent, canActivate: [seguriAdminGuard]},
    {path: 'productos', component: PageProductoComponent, canActivate: [seguriAdminGuard]},
    {path: 'usuarios', component: PageUsuariosComponent, canActivate: [seguriAdminGuard]},
    {path: 'reseñas', component: PageResenaComponent, canActivate: [seguriAdminGuard]},
    {path: 'miperfil', component: PageMiperfilUserComponent, canActivate: [seguriAdminGuard]},
    {path: 'comprobantes', component: PageComprobantesComponent, canActivate: [seguriAdminGuard]},
    {path: '**', pathMatch: 'full', redirectTo: 'inicio' },
];