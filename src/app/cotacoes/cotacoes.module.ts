import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

// Others
import { MyDatePickerModule } from "mydatepicker";
import { SelectModule } from 'ng2-select';
import { WizardModule } from "ng2-archwizard/dist";
import { TextMaskModule } from 'angular2-text-mask';
import { DataTableModule } from "angular2-datatable";

// Bootstrap
import { TypeaheadModule } from 'ng2-bootstrap/typeahead';
import { TooltipModule } from 'ng2-bootstrap/tooltip';

// Components
import { CotacoesComponent } from "app/cotacoes/cotacoes.component";
import { ProdutosComponent } from "app/cotacoes/produtos/produtos.component";
import { ListacotacoesComponent } from './listacotacoes/listacotacoes.component';
import { AutomovelComponent } from './automovel/automovel.component';
import { MenucotacaoComponent } from './menucotacao/menucotacao.component';
import { ResultadoComponent } from "app/cotacoes/resultado/resultado.component";

import { ThreeBounceComponent } from "app/utils/three-bounce";

// Directives
import { OnlyNumber } from "app/diretivas/OnlyNumber";

// Pipes
import { DataFilterPipe } from "app/pipes/data-filter.pipe";
import { MoedaPipe } from "app/pipes/moeda.pipe";

// Services
import { UsuarioService } from "app/usuario/usuario.service";
import { AuthService } from "app/services/AuthService";
import { CotacaoService } from "app/cotacoes/services/cotacao.services";
import { ClienteService } from "app/cotacoes/services/cliente.services";
import { ItemService } from "app/cotacoes/services/item.services";
import { QuestionarioService } from "app/cotacoes/services/questionario.service";
import { PerfilService } from "app/cotacoes/services/perfil.service";
import { CoberturaService } from "app/cotacoes/services/coberturas.service";

// Shared 
import { SharedModule } from "../shared/shared.module";

// Routers
import { cotacoesRouterConfig } from "app/cotacoes/cotacoes.routes";

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(cotacoesRouterConfig),
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        MyDatePickerModule,
        SelectModule,
        WizardModule,
        TextMaskModule,
        DataTableModule,
        TypeaheadModule.forRoot(),
        TooltipModule.forRoot()
    ],
    declarations: [
        CotacoesComponent,
        ProdutosComponent,
        ListacotacoesComponent,
        AutomovelComponent,
        MenucotacaoComponent,
        ThreeBounceComponent,
        ResultadoComponent,
        OnlyNumber,
        DataFilterPipe,
        MoedaPipe
    ],
    providers: [
        UsuarioService,
        CotacaoService,
        ClienteService,
        ItemService,
        QuestionarioService,
        PerfilService,
        CoberturaService,
        AuthService
    ],
    exports: [RouterModule]
})

export class CotacoesModule { }