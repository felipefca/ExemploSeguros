import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Bootstrap
import { CollapseModule } from 'ng2-bootstrap/collapse';
import { CarouselModule } from 'ng2-Bootstrap/carousel';

// Shared Components
import { MenuSuperiorComponent } from '../shared/menu-superior/menu-superior.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { MainPrincipalComponent } from '../shared/main-principal/main-principal.component';
import { MainSliderComponent } from '../shared/main-slider/main-slider.component';
import { MenuLoginComponent } from '../shared/menu-login/menu-login.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CollapseModule,
        CarouselModule
    ],
    declarations: [
        MenuSuperiorComponent,
        MainPrincipalComponent,
        MainSliderComponent,
        FooterComponent,
        MenuLoginComponent
    ],
    exports: [
        MenuSuperiorComponent,
        MainPrincipalComponent,
        MainSliderComponent,
        FooterComponent,
        MenuLoginComponent
    ]
})
export class SharedModule { }