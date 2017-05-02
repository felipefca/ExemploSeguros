import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Bootstrap
import { CollapseModule } from 'ng2-Bootstrap/collapse';
import { CarouselModule } from 'ng2-Bootstrap/carousel';
import { TabsModule } from 'ng2-bootstrap/tabs';

// Others
import { MyDatePickerModule } from "mydatepicker";

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

// Services
import { UsuarioService } from "app/usuario/usuario.service";
import { AuthService } from "app/shared/AuthService";

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
    AcessoNegadoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    CollapseModule.forRoot(),
    CarouselModule.forRoot(),
    TabsModule.forRoot(),
    RouterModule.forRoot(rootRouterConfig, {
      useHash: false
    })
  ],
  providers: [
    UsuarioService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
