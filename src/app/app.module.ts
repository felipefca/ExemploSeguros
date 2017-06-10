import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Bootstrap
import { CollapseModule } from 'ng2-Bootstrap/collapse';
import { CarouselModule } from 'ng2-Bootstrap/carousel';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { TypeaheadModule } from 'ng2-bootstrap/typeahead';

// Others
import { MyDatePickerModule } from "mydatepicker";
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { ToastrCustomOption } from "app/utils/ToastrCustomOption";
import { SelectModule } from 'ng2-select';
import { WizardModule } from "ng2-archwizard/dist";
import { TextMaskModule } from 'angular2-text-mask';
import { DataTableModule } from "angular2-datatable";

// Shared Components
import { MenuSuperiorComponent } from './shared/menu-superior/menu-superior.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MainPrincipalComponent } from './shared/main-principal/main-principal.component';
import { MainSliderComponent } from './shared/main-slider/main-slider.component';
import { MenuLoginComponent } from './shared/menu-login/menu-login.component';
import { AcessoNegadoComponent } from './shared/acesso-negado/acesso-negado.component';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './registro/registro.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListaProdutosComponent } from './dashboard/lista-produtos/lista-produtos.component';
import { CotacoesRealizadasTableComponent } from './dashboard/cotacoes-realizadas-table/cotacoes-realizadas-table.component';
import { MenuCotacaoComponent } from './cotacao/menu-cotacao/menu-cotacao.component';
import { AutomovelPanelComponent } from './automovel-panel/automovel-panel.component';

// Directives
import { OnlyNumber } from "app/diretivas/OnlyNumber";

// Pipes
import { DataFilterPipe } from "app/pipes/data-filter.pipe";
import { MoedaPipe } from "app/pipes/moeda.pipe";

// Services
import { UsuarioService } from "app/usuario/usuario.service";
import { AuthService } from "app/services/AuthService";
import { CotacaoService } from "app/cotacao/services/cotacao.services";
import { ClienteService } from "app/cotacao/services/cliente.services";
import { ItemService } from "app/cotacao/services/item.services";
import { QuestionarioService } from "app/cotacao/services/questionario.service";
import { PerfilService } from "app/cotacao/services/perfil.service";


@NgModule({
  declarations: [
    AppComponent,
    MenuSuperiorComponent,
    FooterComponent,
    MainPrincipalComponent,
    MainSliderComponent,
    MenuLoginComponent,
    LoginComponent,
    HomeComponent,
    RegistroComponent,
    DashboardComponent,
    ListaProdutosComponent,
    CotacoesRealizadasTableComponent,
    MenuCotacaoComponent,
    AutomovelPanelComponent,
    AcessoNegadoComponent,
    OnlyNumber,
    DataFilterPipe,
    MoedaPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    SelectModule,
    WizardModule,
    TextMaskModule,
    DataTableModule,
    ToastModule.forRoot(),
    CollapseModule.forRoot(),
    CarouselModule.forRoot(),
    TabsModule.forRoot(),
    TypeaheadModule.forRoot(),
    RouterModule.forRoot(rootRouterConfig, {
      useHash: false
    })
  ],
  providers: [
    UsuarioService,
    CotacaoService,
    ClienteService,
    ItemService,
    QuestionarioService,
    PerfilService,
    AuthService,
    { provide: ToastOptions, useClass: ToastrCustomOption }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
