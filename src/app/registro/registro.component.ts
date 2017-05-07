import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, FormArray, Validators, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';

import { Usuario } from "app/usuario/usuario";
import { UsuarioService } from "app/usuario/usuario.service";

import { CustomValidators, CustomFormsModule } from "ng2-validation";
import { GenericValidator } from "app/utils/generic-form-validator";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit, AfterViewInit {

  //Diretivas
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  //Coleção vazia
  public errors: any[] = [];
  public registroForm: FormGroup;
  public usuario: Usuario;

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
      },
      confirmPassword: {
        required: 'Informe a senha novamente',
        minLength: 'A senha deve possuir no mínimo 6 caracteres',
        equalTo: 'As senhas não conferem'
      }
    };

    this.GenericValidator = new GenericValidator(this.validationMessages);
    this.usuario = new Usuario();
  }

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private GenericValidator: GenericValidator;

  ngOnInit() {
    let password = new FormControl('', [Validators.required, Validators.minLength(6)]);
    let confirmPassword = new FormControl('', [Validators.required, Validators.minLength(6), CustomValidators.equalTo(password)]);

    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(50), CustomValidators.email]],
      password: password,
      confirmPassword: confirmPassword
    });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(this.registroForm.valueChanges, ...controlBlurs).debounceTime(500).subscribe(value => {
      this.displayMessage = this.GenericValidator.processMessages(this.registroForm);
    });
  }

  registrarUsuario() {
    if (this.registroForm.dirty && this.registroForm.valid) {
      let p = Object.assign({}, this.usuario, this.registroForm.value);

      this.usuarioService.registrarUsuario(p)
        .subscribe(
        result => { this.onSaveComplete(result) },
        error => {
          this.errors = JSON.parse(error._body).errors;
        });
    }
  }

  onSaveComplete(response: any): void {
    this.registroForm.reset();
    this.errors = [];

    localStorage.setItem('exs.token', response.result.access_token);
    localStorage.setItem('exs.user', JSON.stringify(response.result.user));

    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
  }
}
