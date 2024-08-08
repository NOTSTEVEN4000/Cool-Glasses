import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegistroComponent } from "./registro/registro.component";
import { CambiopasswordComponent } from "./cambiopassword/cambiopassword.component";

export const AUTH_ROUTES: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'recuperar', component: CambiopasswordComponent },
];