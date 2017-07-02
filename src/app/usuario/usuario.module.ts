import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { LoginComponent } from '../usuario/login/login.component';
import { RegistroComponent } from '../usuario/registro/registro.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        LoginComponent,
        RegistroComponent,
    ],
    exports: [
        LoginComponent,
        RegistroComponent,
    ]
})
export class UsuarioModule { }