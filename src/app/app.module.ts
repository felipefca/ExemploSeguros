import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Bootstrap
import { CollapseModule } from 'ng2-Bootstrap/collapse';
import { CarouselModule } from 'ng2-Bootstrap/carousel';
import { TabsModule } from 'ng2-bootstrap/tabs';

// Others
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { ToastrCustomOption } from "app/utils/ToastrCustomOption";

// Shared Components
import { AcessoNegadoComponent } from './shared/acesso-negado/acesso-negado.component';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

// Modules
import { SharedModule } from "./shared/shared.module";
import { UsuarioModule } from "./usuario/usuario.module";

// Services
import { UsuarioService } from "app/usuario/usuario.service";
import { AuthService } from "app/services/AuthService";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AcessoNegadoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    SharedModule,
    UsuarioModule,
    ToastModule.forRoot(),
    CollapseModule.forRoot(),
    CarouselModule.forRoot(),
    TabsModule.forRoot(),
    RouterModule.forRoot(rootRouterConfig, {
      useHash: false
    })
  ],
  providers: [
    UsuarioService,
    AuthService,
    { provide: ToastOptions, useClass: ToastrCustomOption }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
