import { Routes } from '@angular/router';

import { LoginComponent } from './usuario/login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './usuario/registro/registro.component';
import { AcessoNegadoComponent } from "app/shared/acesso-negado/acesso-negado.component";

export const rootRouterConfig: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'acesso-negado', component: AcessoNegadoComponent },
    { path: 'cotacoes', loadChildren: 'app/cotacoes/cotacoes.module#CotacoesModule' }
];