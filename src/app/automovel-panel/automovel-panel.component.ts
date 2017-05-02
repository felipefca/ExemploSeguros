import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, FormArray, Validators, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';

import { IMyOptions, IMyDateModel } from 'mydatepicker';
import { DateUtils } from "app/utils/date-utils";

import { CustomValidators, CustomFormsModule } from "ng2-validation";
import { GenericValidator } from "app/utils/generic-form-validator";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { Cotacao } from "app/cotacao/models/cotacao";
import { TipoSeguro } from "app/cotacao/models/tipoSeguro";
import { TipoCalculo } from "app/cotacao/models/tipoCalculo";

@Component({
  selector: 'app-automovel-panel',
  templateUrl: './automovel-panel.component.html',
  styleUrls: ['./automovel-panel.component.css']
})
export class AutomovelPanelComponent implements OnInit {
  // Diretivas
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  
  private myDatePickerOptions = DateUtils.getMyDatePickerOptions();

  // Coleção vazia
  public errors: any[] = [];
  public cotacaoForm: FormGroup;

  // Variáveis 
  public cotacao: Cotacao;
  public tipoSeguro: TipoSeguro[];
  public tipoCalculo: TipoCalculo[];

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private GenericValidator: GenericValidator;

  constructor(private fb: FormBuilder, private router: Router) {

    this.validationMessages = {
      tipoSeguroId: {
        required: 'Informe o Tipo de Seguro.'
      },
      tipoCalculoId: {
        required: 'Informe o Tipo de Cálculo.'
      },
      dataInicio: {
        required: 'Informe a Data de Vigência Inicial'
      },
      dataFim: {
        required: 'Informe a Data de Vigência Final'
      }
    };

    this.GenericValidator = new GenericValidator(this.validationMessages);
    this.cotacao = new Cotacao()
  }

  ngOnInit() {
    this.cotacaoForm = this.fb.group({
      tipoSeguroId: ['', Validators.required],
      tipoCalculoId: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required]
    });
  }

  adicionarCotacao() {
    if (this.cotacaoForm.dirty && this.cotacaoForm.valid) {
      let p = Object.assign({}, this.cotacao, this.cotacaoForm.value);

      /*      this.usuarioService.registrarUsuario(p)
              .subscribe(
              result => { this.onSaveComplete(result) },
              error => {
                this.errors = JSON.parse(error._body).errors;
              });*/
    }
  }
}
