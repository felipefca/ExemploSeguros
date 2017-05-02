import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';

import { Router } from "@angular/router";

import { CustomValidators, CustomFormsModule } from "ng2-validation";
import { GenericValidator } from "app/utils/generic-form-validator";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';

import { Usuario } from "app/usuario/usuario";
import { UsuarioService } from "app/usuario/usuario.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  //Diretivas
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  //Coleção vazia
  public errors: any[] = [];
  public loginForm: FormGroup;
  public usuario: Usuario;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private GenericValidator: GenericValidator;

  constructor(private fb: FormBuilder, private router: Router, private usuarioService: UsuarioService) {

    this.validationMessages = {
      email: {
        required: 'Informe o E-Mail.',
        maxLength: 'O E-Mail precisa ter no máximo 50 caracteres.',
        email: 'E-Mail inválido.'
      },
      password: {
        required: 'Informe a Senha',
        minLength: 'A senha deve possuir no mínimo 6 caracteres'
      }
    };

    this.GenericValidator = new GenericValidator(this.validationMessages);
    this.usuario = new Usuario();
  }

  ngOnInit() {
    let password = new FormControl('', [Validators.required, Validators.minLength(6)]);

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(50), CustomValidators.email]],
      password: password
    });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(this.loginForm.valueChanges, ...controlBlurs).debounceTime(500).subscribe(value => {
      this.displayMessage = this.GenericValidator.processMessages(this.loginForm);
    });
  }

  logarUsuario() {
    if (this.loginForm.dirty && this.loginForm.valid) {
      let p = Object.assign({}, this.usuario, this.loginForm.value);

      this.usuarioService.login(p)
        .subscribe(
        result => { this.onSaveComplete(result) },
        error => {
          this.errors = JSON.parse(error._body).errors;
        });
    }
  }

  onSaveComplete(response: any): void {
    this.loginForm.reset();
    this.errors = [];

    localStorage.setItem('exs.token', response.result.access_token);
    localStorage.setItem('exs.user', JSON.stringify(response.result.user));

    this.router.navigate(['/home']);
  }

}
