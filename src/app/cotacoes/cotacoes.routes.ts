import { Routes } from '@angular/router';

// Components
import { CotacoesComponent } from "app/cotacoes/cotacoes.component";
import { ProdutosComponent } from "app/cotacoes/produtos/produtos.component";
import { AutomovelComponent } from './automovel/automovel.component';

// Services
import { AuthService } from "app/services/AuthService";

export const cotacoesRouterConfig: Routes = [
    {
        path: '', canActivate: [AuthService], component: CotacoesComponent, data: [{ claim: { nome: 'Cotacao', valor: 'Gravar' } }],
        children: [
            { path: '', canActivate: [AuthService], component: ProdutosComponent, data: [{ claim: { nome: 'Cotacao', valor: 'Gravar' } }] },
            { path: 'automovel', canActivate: [AuthService], component: AutomovelComponent, data: [{ claim: { nome: 'Cotacao', valor: 'Gravar' } }] }
        ] 
    }
]; 