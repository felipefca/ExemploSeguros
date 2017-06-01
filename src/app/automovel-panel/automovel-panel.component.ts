import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, FormArray, Validators, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';

import { IMyOptions, IMyDateModel } from 'mydatepicker';
import { DateUtils } from "app/utils/date-utils";
import { UnMasked } from "app/utils/unMasked";
import { SelectModule, SelectComponent, SelectItem } from 'ng2-select';
import { TabsModule, TabsetComponent } from 'ng2-bootstrap/tabs';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { CustomValidators, CustomFormsModule } from "ng2-validation";
import { GenericValidator } from "app/utils/generic-form-validator";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

// Models
import { Cotacao } from "app/cotacao/models/cotacao";
import { Endereco } from "app/cotacao/models/endereco";
import { Cliente } from "app/cotacao/models/cliente";
import { TipoSeguro } from "app/cotacao/models/tipoSeguro";
import { TipoCalculo } from "app/cotacao/models/tipoCalculo";
import { Profissao } from "app/cotacao/models/profissao";
import { PaisResidencia } from "app/cotacao/models/paisResidencia";
import { Item } from "app/cotacao/models/item";
import { Imposto } from "app/cotacao/models/imposto";
import { Marca } from "app/cotacao/models/marca";
import { Uso } from "app/cotacao/models/uso";
import { Modelo } from "app/cotacao/models/modelo";

// Services
import { CotacaoService } from "app/cotacao/services/cotacao.services";
import { ClienteService } from "app/cotacao/services/cliente.services";
import { ItemService } from "app/cotacao/services/item.services";

// Constantes
const KmSufix = createNumberMask({
  suffix: 'Km',
  prefix: '',
  allowDecimal: false,
  integerLimit: 3,
  allowNegative: false
})

@Component({
  selector: 'app-automovel-panel',
  templateUrl: './automovel-panel.component.html',
  styleUrls: ['./automovel-panel.component.css']
})
export class AutomovelPanelComponent implements OnInit {
  // Diretivas
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  @ViewChild('SelectTipoSeguroId') public selectTS: SelectComponent
  @ViewChild('SelectProfissaoId') public selectPO: SelectComponent
  @ViewChild('SelectPaisResidenciaId') public selectPR: SelectComponent
  @ViewChild('SelectTipoCalculoId') public selectTC: SelectComponent
  @ViewChild('SelectMarcaId') public selectMA: SelectComponent
  @ViewChild('SelectUsoId') public selectUS: SelectComponent
  @ViewChild('SelectImpostoId') public selectIM: SelectComponent
  @ViewChild('SelectAnoModelo') public selectAnoMod: SelectComponent
  @ViewChild('SelectAnoFabricacao') public selectAnoFab: SelectComponent

  private myDatePickerOptions = DateUtils.getMyDatePickerOptions();

  //public modeloCtrl: FormControl = new FormControl();

  // Coleção vazia
  public listModelos: string[] = [];
  public errors: any[] = [];
  public errorsVeic: any[] = [];
  public cotacaoForm: FormGroup;

  // Variáveis 
  public cotacao: Cotacao;
  public cliente: Cliente;
  public endereco: Endereco;
  public item: Item;
  public tipoSeguro: TipoSeguro[];
  public tipoCalculo: TipoCalculo[];
  public profissoes: Profissao[];
  public paises: PaisResidencia[];
  public impostos: Imposto[];
  public usos: Uso[];
  public marcas: Marca[];
  public modelos: Modelo[];

  // Variáveis Auxiliáres
  meuCEP: any;
  buscaVeiculo: boolean = false;
  flagVeiculoSelecionado: boolean = false;
  public data: any[];
  public rowsOnPage = 5;
  modeloId: string;
  numCotacao: any;

  // Coleções
  public anos: Array<string> = ['2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'];

  // Mascáras
  public maskCPF = [/[0-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public maskRG = [/[0-9]/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/];
  public maskFone = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskCEP = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public maskDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public maskKm = KmSufix;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private GenericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
    private router: Router,
    private cotacaoService: CotacaoService,
    private clienteService: ClienteService,
    private itemService: ItemService) {

    this.validationMessages = {
      tipoSeguroId: {
        required: 'Informe o Tipo de Seguro.'
      },
      tipoCalculoId: {
        required: 'Informe o Tipo de Cálculo.'
      },
      dataVigenciaInicial: {
        required: 'Informe a Data de Vigência Inicial'
      },
      dataVigenciaFinal: {
        required: 'Informe a Data de Vigência Final'
      },
      nome: {
        required: "Informe o Nome",
        minlength: 'O Nome precisa ter no mínimo 2 caracteres',
        maxlength: 'O Nome precisa ter no máximo 150 caracteres'
      },
      sobrenome: {
        required: "Informe o SobreNome",
        minlength: 'O SobreNome precisa ter no mínimo 2 caracteres',
        maxlength: 'O SobreNome precisa ter no máximo 150 caracteres'
      },
      email: {
        required: 'Informe o e-mail',
        email: 'Email invalido'
      },
      cpf: {
        required: 'Informe o CPF',
        rangeLength: 'CPF deve conter 11 caracteres'
      },
      telefone: {
        required: "Informe o Telefone",
        rangeLength: 'O Telefone deve conter 8 ou 9 caracteres'
      },
      rg: {
        required: 'Informe o RG',
        rangeLength: 'RG deve conter 7 caracteres'
      },
      dataNascimento: {
        required: 'Informe a data de Nascimento'
      },
      profissaoId: {
        required: 'Informe a Profissão.'
      },
      paisResidenciaId: {
        required: 'Informe o Pais de Residencia.'
      },
      logradouro: {
        required: 'Informe o Logradouro.',
        minlength: 'O Logradouro precisa ter no mínimo 2 caracteres',
        maxlength: 'O Logradouro precisa ter no máximo 100 caracteres'
      },
      numero: {
        required: 'Informe o Número.',
        minlength: 'O Número precisa ter no mínimo 2 caracteres',
        maxlength: 'O Número precisa ter no máximo 10 caracteres'
      },
      bairro: {
        required: 'Informe o Bairro.',
        minlength: 'O Bairro precisa ter no mínimo 2 caracteres',
        maxlength: 'O Bairro precisa ter no máximo 100 caracteres'
      },
      cep: {
        required: 'Informe o CEP.',
        rangeLength: 'O CEP deve conter 8 caracteres'
      },
      cidade: {
        required: 'Informe a Cidade.',
        minlength: 'A Cidade precisa ter no mínimo 2 caracteres',
        maxlength: 'A Cidade precisa ter no máximo 100 caracteres'
      },
      estado: {
        required: 'Informe o Estado.',
        minlength: 'O Estado precisa ter no mínimo 2 caracteres',
        maxlength: 'O Estado precisa ter no máximo 100 caracteres'
      },
      usoId: {
        required: 'Informe o Uso do Veículo.'
      },
      impostoId: {
        required: 'Informe a Isenção de Imposto.'
      },
      nomeModelo: {
        required: 'Informe o Modelo do Veículo.'
      },
      marcaId: {
        required: 'Informe a marca do Veículo.'
      },
      flagRemarcado: {
        required: 'Selecione uma resposta para o Campo "Chassi Remarcado?"'
      },
      anoModelo: {
        required: 'Informe o ano do Modelo'
      },
      anoFabricacao: {
        required: 'Informe o ano de Fabricação do Veículo'
      }
    };

    this.GenericValidator = new GenericValidator(this.validationMessages);
    this.cotacao = new Cotacao();
    this.cotacao.cliente = new Cliente();
    this.cotacao.cliente.endereco = new Endereco();
    this.cotacao.item = new Item();

    this.gerarNumCotacao();
  }

  ngOnInit() {
    this.cotacaoForm = this.fb.group({
      tipoSeguroId: ['', Validators.required],
      tipoCalculoId: ['', Validators.required],
      dataVigenciaInicial: ['', Validators.required],
      dataVigenciaFinal: ['', Validators.required],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      sobrenome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      email: ['', [Validators.required, CustomValidators.email]],
      cpf: ['', [Validators.required, CustomValidators.rangeLength([11, 11])]],
      telefone: ['', [Validators.required, CustomValidators.rangeLength([10, 11])]],
      rg: ['', [Validators.required, CustomValidators.rangeLength([7, 7])]],
      dataNascimento: ['', Validators.required],
      profissaoId: ['', Validators.required],
      paisResidenciaId: ['', Validators.required],
      logradouro: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      numero: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      complemento: '',
      bairro: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      cep: ['', [Validators.required, CustomValidators.rangeLength([8, 8])]],
      cidade: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      estado: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      marcaId: ['', Validators.required],
      nomeModelo: ['', Validators.required],  // this.modeloCtrl,
      flagRemarcado: ['', Validators.required],
      anoFabricacao: ['', Validators.required],
      anoModelo: ['', Validators.required],
      flagZeroKm: '',
      numChassi: '',
      dataSaida: '',
      odometro: '',
      usoId: ['', Validators.required],
      impostoId: ['', Validators.required]
    });

    this.getTiposCalculo();
    this.getTiposSeguro();
    this.getPaises();
    this.getProfissoes();
    this.getUsos();
    this.getImpostos();
    this.getMarcas();

    this.onDisableDates();
    this.onInitilizeRadios();
  }

  adicionarCotacao() {

    UnMasked.unMaskFormComponents(this.cotacaoForm);
    this.displayMessage = this.GenericValidator.processMessages(this.cotacaoForm);

    if (this.cotacaoForm.dirty && this.cotacaoForm.valid) {
      let user = this.cotacaoService.obterUsuario();
      let c = Object.assign({}, this.cotacao, this.cotacaoForm.value);

      // Cotação
      c.userId = user.id;
      c.tipoSeguroId = this.selectTS.activeOption.id;
      c.tipoCalculoId = this.selectTC.activeOption.id;
      c.numCotacao = this.numCotacao;
      c.dataVigenciaInicial = DateUtils.getMyDatePickerDate(c.dataVigenciaInicial);
      c.dataVigenciaFinal = DateUtils.getMyDatePickerDate(c.dataVigenciaFinal);

      // Cliente
      c.cliente.id = undefined;
      c.cliente.nome = c.nome;
      c.cliente.sobreNome = c.sobrenome;
      c.cliente.email = c.email;
      c.cliente.cpf = c.cpf; //this.clearMaskControls(c.cpf.toString());
      c.cliente.telefone = c.telefone;
      c.cliente.rg = c.rg
      c.cliente.dataNascimento = DateUtils.getMyDatePickerDate(c.dataNascimento);
      c.cliente.profissaoId = this.selectPO.activeOption.id;
      c.cliente.paisResidenciaId = this.selectPR.activeOption.id;

      //Endereço
      c.cliente.endereco.id = undefined;
      c.cliente.endereco.logradouro = c.logradouro;
      c.cliente.endereco.numero = c.numero;
      c.cliente.endereco.complemento = c.complemento;
      c.cliente.endereco.bairro = c.bairro;
      c.cliente.endereco.cep = c.cep;
      c.cliente.endereco.cidade = c.cidade;
      c.cliente.endereco.estado = c.estado;

      //Item
      c.item.id = undefined;
      c.item.numChassi = c.numChassi;
      c.item.flagRemarcado = c.flagRemarcado;
      c.item.dataSaida = c.dataSaida;
      c.item.odometro = c.odometro;
      c.item.produtoId = "1";
      c.item.modeloId = this.modeloId;
      c.item.usoId = this.selectUS.activeOption.id;
      c.item.impostoId = this.selectIM.activeOption.id;

      this.cotacaoService.registrarCotacao(c)
        .subscribe(
        result => { this.onSaveComplete() },
        error => { this.onError(error) });

    } else {
      this.errors = [];
      this.errors.push("Campos obrigatórios não preenchidos !!!");
    }
  }

  onSaveComplete(): void {
    this.cotacaoForm.reset();
    this.errors = [];
  }

  onError(error): void {
    this.errors = JSON.parse(error._body).errors;
    console.log(error);
  }

  getProfissoes(): void {
    this.clienteService.obterProfissoes()
      .subscribe(
      apiProfissoes => {
        this.profissoes = apiProfissoes;
        this.profissoes.forEach(item => {
          item.profissaoId = item.profissaoId.toString();
          this.selectPO.itemObjects.push(new SelectItem({ id: item.profissaoId, text: item.nome }))
        });
      },
      error => this.errors
      );
  }

  getPaises(): void {
    this.clienteService.obterPaises()
      .subscribe(
      apiPaises => {
        this.paises = apiPaises;
        this.paises.forEach(item => {
          item.paisResidenciaId = item.paisResidenciaId.toString();
          this.selectPR.itemObjects.push(new SelectItem({ id: item.paisResidenciaId, text: item.nome }))
        });
      },
      error => this.errors
      );
  }

  getTiposSeguro(): void {
    this.cotacaoService.obterTipoSeguro()
      .subscribe(
      apiTipoSeguro => {
        this.tipoSeguro = apiTipoSeguro;
        this.tipoSeguro.forEach(item => {
          item.tipoSeguroId = item.tipoSeguroId.toString();
          this.selectTS.itemObjects.push(new SelectItem({ id: item.tipoSeguroId, text: item.descricao }))
        });
      },
      error => this.errors
      );
  }

  getTiposCalculo(): void {
    this.cotacaoService.obterTiposCalculo()
      .subscribe(
      apiTipoCalculo => {
        this.tipoCalculo = apiTipoCalculo;
        this.tipoCalculo.forEach(item => {
          item.tipoCalculoId = item.tipoCalculoId.toString();
          this.selectTC.itemObjects.push(new SelectItem({ id: item.tipoCalculoId, text: item.descricao }))
        });
      },
      error => this.errors
      );
  }

  getUsos(): void {
    this.itemService.obterUsos()
      .subscribe(
      apiUsos => {
        this.usos = apiUsos;
        this.usos.forEach(item => {
          item.usoId = item.usoId.toString();
          this.selectUS.itemObjects.push(new SelectItem({ id: item.usoId, text: item.descricao }))
        });
      },
      error => this.errors
      );
  }

  getImpostos(): void {
    this.itemService.obterImpostos()
      .subscribe(
      apiImpostos => {
        this.impostos = apiImpostos;
        this.impostos.forEach(item => {
          item.impostoId = item.impostoId.toString();
          this.selectIM.itemObjects.push(new SelectItem({ id: item.impostoId, text: item.descricao }))
        });
      },
      error => this.errors
      );
  }

  getMarcas(): void {
    this.itemService.obterMarcas()
      .subscribe(
      apiMarcas => {
        this.marcas = apiMarcas;
        this.marcas.forEach(item => {
          item.marcaId = item.marcaId.toString();
          this.selectMA.itemObjects.push(new SelectItem({ id: item.marcaId, text: item.nome }))
        });
      },
      error => this.errors
      );
  }

  onBlurCEP() {
    let validaCEP = /^[0-9]{8}$/;
    let cep = UnMasked.clearMaskControls(this.meuCEP.toString());

    if (validaCEP.test(cep)) {
      this.cotacaoForm.controls['logradouro'].setValue("...");
      this.cotacaoForm.controls['bairro'].setValue("...");
      this.cotacaoForm.controls['cidade'].setValue("...");
      this.cotacaoForm.controls['estado'].setValue("...");

      this.clienteService.obterCEP(cep)
        .subscribe(
        result => {
          if (result.erro) {
            alert("CEP não encontrado!");
            this.clearControls();
          } else {
            this.cotacaoForm.controls['complemento'].enable();
            this.cotacaoForm.controls['numero'].enable();
            this.cotacaoForm.controls['logradouro'].setValue(result.logradouro);
            this.cotacaoForm.controls['bairro'].setValue(result.bairro);
            this.cotacaoForm.controls['cidade'].setValue(result.localidade);
            this.cotacaoForm.controls['estado'].setValue(result.uf);
          }
        },
        error => {
          this.clearControls();
          alert("Formato de CEP invalido!");
        });

    } else {
      this.clearControls();
      alert("Formato de CEP invalido!");
    }
  }

  clearControls(): void {
    this.cotacaoForm.controls['complemento'].disable();
    this.cotacaoForm.controls['numero'].disable();
    this.cotacaoForm.controls['complemento'].setValue("");
    this.cotacaoForm.controls['numero'].setValue("");
    this.cotacaoForm.controls['logradouro'].setValue("");
    this.cotacaoForm.controls['bairro'].setValue("");
    this.cotacaoForm.controls['cidade'].setValue("");
    this.cotacaoForm.controls['estado'].setValue("");
  }

  onDisableDates() {
    this.cotacaoForm.controls['dataVigenciaInicial'].disabled;
    this.cotacaoForm.controls['dataVigenciaFinal'].disabled;
  }

  changeSourceTC($event): void {
    let dateNow = DateUtils.convertUTCDateToLocalDate(new Date());
    this.cotacaoForm.controls['dataVigenciaInicial'].setValue(DateUtils.setMyDatePickerDate(dateNow));

    if ($event == 1) {
      this.cotacaoForm.controls['dataVigenciaFinal'].setValue(DateUtils.setMyDatePickerOneYear(dateNow));
      this.onDisableDates();
    }
    else if ($event == 2) {
      this.cotacaoForm.controls['dataVigenciaFinal'].setValue(DateUtils.setMyDatePickerTwoYear(dateNow));
      this.onDisableDates();
    }
    else {
      this.cotacaoForm.controls['dataVigenciaFinal'].enabled;
      this.cotacaoForm.controls['dataVigenciaFinal'].setValue('');
    }
  }

  removeSourceTC($event) {
    this.onDisableDates();
    this.cotacaoForm.controls['dataVigenciaInicial'].setValue('');
    this.cotacaoForm.controls['dataVigenciaFinal'].setValue('');
  }

  changeSourceAnoFab($event): void {
    this.selectAnoMod.itemObjects = [];

    let anoFabSelect = this.selectAnoFab.activeOption.id;
    if (anoFabSelect !== "2017") {
      for (var i = 0; i < this.anos.length; i++) {
        if (anoFabSelect == this.anos[i]) {
          this.selectAnoMod.itemObjects.push(new SelectItem({ id: this.anos[i - 1], text: this.anos[i - 1] }))
        }
      }
    }
    this.selectAnoMod.itemObjects.push(new SelectItem({ id: $event.id, text: $event.text }))
  }

  removeSourceAnoFab($event): void {
    this.selectAnoMod.itemObjects = [];
    this.selectAnoMod.active = [];
  }

  changeSourceMarca($event): void {
    this.cotacaoForm.controls['nomeModelo'].setValue('');
    this.itemService.obterNomeModelosMarcas(this.selectMA.activeOption.id)
      .subscribe(data => this.listModelos = data);
  }

  removeSourceMarca($event): void {
    this.listModelos = [];
    this.cotacaoForm.controls['nomeModelo'].setValue('');
  }

  zeroKmChanged($event): void {
    this.cotacaoForm.controls['dataSaida'].setValue('');
    this.cotacaoForm.controls['odometro'].setValue('');
  }

  buscarVeiculos($event): void {
    this.errorsVeic = [];
    let nomeVeic = this.cotacaoForm.controls['nomeModelo'].value;
    let anoFab = this.selectAnoFab.active.length > 0 ? this.selectAnoFab.activeOption.id : "";
    let anoMod = this.selectAnoMod.active.length > 0 ? this.selectAnoMod.activeOption.id : "";
    let zeroKm = this.cotacaoForm.controls['flagZeroKm'].value == true ? "1" : "0";

    if (nomeVeic !== null && anoFab !== "" && anoMod !== "") {
      this.buscaVeiculo = true;
      //this.cotacaoForm.controls['nomeModelo'].disable();
      this.itemService.obterModelosParaSelecao(this.selectMA.activeOption.id, nomeVeic, anoFab, anoMod, zeroKm)
        .subscribe(
        modelos => {
          this.data = modelos;
          if (this.data.length == 0) {
            this.errorsVeic.push("Não foram encontrados veículos com essas referências. Por favor efetuar nova pesquisa !!!");
          }
        },
        error => this.errors
        );

    } else {
      this.buscaVeiculo = false;
      this.errorsVeic = [];
      this.errorsVeic.push("Campos referentes a busca de veículos não preenchidos !!!");
    }
  }

  retornaPesquisa($event): void {
    this.buscaVeiculo = false;
    this.flagVeiculoSelecionado = false;
    //this.cotacaoForm.controls['nomeModelo'].enable();
    this.data = [];
    this.errorsVeic = [];
  }

  selecionaVeiculo($event, $id): void {
    this.itemService.obterDadosModeloSelecionado($id)
      .subscribe(
      apiData => {
        this.modelos = apiData;
        this.flagVeiculoSelecionado = true;
        this.modeloId = $id;
      },
      error => this.errors
      );
  }

  onInitilizeRadios(): void {
    this.cotacaoForm.controls['flagRemarcado'].setValue('false');
  }

  gerarNumCotacao(): void {
    this.cotacaoService.gerarNumCotacaoRandomico()
      .subscribe(
      apiData => {
        this.numCotacao = apiData;
      },
      error => this.errors
      );
  }
}

