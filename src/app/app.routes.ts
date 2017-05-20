import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './registro/registro.component';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AutomovelPanelComponent } from "app/automovel-panel/automovel-panel.component";
import { AuthService } from "app/services/AuthService";
import { AcessoNegadoComponent } from "app/shared/acesso-negado/acesso-negado.component";

export const rootRouterConfig: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent},
    { path: 'login', component: LoginComponent},
    { path: 'registro', component: RegistroComponent},
    { path: 'dashboard', canActivate: [AuthService], component: DashboardComponent, data: [{ claim: { nome: 'Cotacao', valor: 'Gravar'}}]},
    { path: 'auto', canActivate: [AuthService], component: AutomovelPanelComponent, data: [{ claim: { nome: 'Cotacao', valor: 'Gravar'}}]},
    { path: 'acesso-negado', component: AcessoNegadoComponent}
]