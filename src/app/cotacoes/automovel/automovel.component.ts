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
import { MovingDirection } from "ng2-archwizard/dist";

import { CustomValidators, CustomFormsModule } from "ng2-validation";
import { GenericValidator } from "app/utils/generic-form-validator";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

// Models
import { Cotacao } from "app/cotacoes/models/cotacao";
import { Endereco } from "app/cotacoes/models/endereco";
import { Cliente } from "app/cotacoes/models/cliente";
import { TipoSeguro } from "app/cotacoes/models/tipoSeguro";
import { TipoCalculo } from "app/cotacoes/models/tipoCalculo";
import { Profissao } from "app/cotacoes/models/profissao";
import { PaisResidencia } from "app/cotacoes/models/paisResidencia";
import { Item } from "app/cotacoes/models/item";
import { Imposto } from "app/cotacoes/models/imposto";
import { Marca } from "app/cotacoes/models/marca";
import { Uso } from "app/cotacoes/models/uso";
import { Modelo } from "app/cotacoes/models/modelo";
import { Questionario } from "app/cotacoes/models/questionario";
import { Rastreador } from "app/cotacoes/models/rastreador";
import { AntiFurto } from "app/cotacoes/models/antiFurto";
import { GaragemTrabalho } from "app/cotacoes/models/garagemTrabalho";
import { GaragemFaculdade } from "app/cotacoes/models/garagemFaculdade";
import { GaragemResidencia } from "app/cotacoes/models/garagemResidencia";
import { PropriedadeRastreador } from "app/cotacoes/models/propriedadeRastreador";
import { RelacaoSegurado } from "app/cotacoes/models/relacaoSegurado";
import { Perfil } from "app/cotacoes/models/perfil";
import { DistanciaTrabalho } from "app/cotacoes/models/distanciaTrabalho";
import { EstadoCivil } from "app/cotacoes/models/estadoCivil";
import { Sexo } from "app/cotacoes/models/sexo";
import { QuantidadeVeiculos } from "app/cotacoes/models/quantidadeVeiculos";
import { TempoHabilitacao } from "app/cotacoes/models/tempoHabilitacao";
import { TipoResidencia } from "app/cotacoes/models/tipoResidencia";

// Services
import { CotacaoService } from "app/cotacoes/services/cotacao.services";
import { ClienteService } from "app/cotacoes/services/cliente.services";
import { ItemService } from "app/cotacoes/services/item.services";
import { QuestionarioService } from "app/cotacoes/services/questionario.service";
import { PerfilService } from "app/cotacoes/services/perfil.service";
import { CoberturaService } from "app/cotacoes/services/coberturas.service";

// Constantes
const KmSufix = createNumberMask({
  suffix: 'Km',
  prefix: '',
  allowDecimal: false,
  integerLimit: 3,
  allowNegative: false
})

@Component({
  selector: 'app-automovel',
  templateUrl: './automovel.component.html',
  styleUrls: ['./automovel.component.css']
})
export class AutomovelComponent implements OnInit {

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
  @ViewChild('SelectRelacaoSeguradoId') public selectRelSeg: SelectComponent
  @ViewChild('SelectRastreadorId') public selectRast: SelectComponent
  @ViewChild('SelectAntiFurtoId') public selectAnti: SelectComponent
  @ViewChild('SelectPropRastreadorId') public selectPropRast: SelectComponent
  @ViewChild('SelectGarResidenciaId') public selectGarRes: SelectComponent
  @ViewChild('SelectGarFaculdadeId') public selectGarFac: SelectComponent
  @ViewChild('SelectGarTrabalhoId') public selectGarTrab: SelectComponent
  @ViewChild('SelectEstadoCivilId') public selectEstCiv: SelectComponent
  @ViewChild('SelectSexoId') public selectSex: SelectComponent
  @ViewChild('SelectTempoHabilitacaoId') public selectTempHab: SelectComponent
  @ViewChild('SelectTipoResidenciaId') public selectTipRes: SelectComponent
  @ViewChild('SelectQtdVeiculosId') public selectQtdVeic: SelectComponent
  @ViewChild('SelectDistTrabalhoId') public selectDistTrab: SelectComponent
  @ViewChild('SelectCoberturas') public selectCoberturas: SelectComponent
  @ViewChild("elem", { read: ElementRef }) elemCob: ElementRef;

  private myDatePickerOptions = DateUtils.getMyDatePickerOptions();

  // Coleção vazia
  public listModelos: string[] = [];
  public listCoberturas: any[] = [];
  public listSelectValCoberturas = [];
  public errors: any[] = [];
  public errorsVeic: any[] = [];
  public cotacaoForm: FormGroup;

  // Variáveis 
  public cotacao: Cotacao;
  public cliente: Cliente;
  public endereco: Endereco;
  public item: Item;
  public questionario: Questionario;
  public perfil: Perfil;
  public tipoSeguro: TipoSeguro[];
  public tipoCalculo: TipoCalculo[];
  public profissoes: Profissao[];
  public paises: PaisResidencia[];
  public impostos: Imposto[];
  public usos: Uso[];
  public marcas: Marca[];
  public modelos: Modelo[];
  public rastreadores: Rastreador[];
  public antifurtos: AntiFurto[];
  public garagemFaculdade: GaragemFaculdade[];
  public garagemTrabalho: GaragemTrabalho[];
  public garagemResidencia: GaragemResidencia[];
  public propriedadeRastreadores: PropriedadeRastreador[];
  public relacaoSegurado: RelacaoSegurado[];
  public distanciaTrabalho: DistanciaTrabalho[];
  public estadoCivil: EstadoCivil[];
  public quantidadeVeiculos: QuantidadeVeiculos[];
  public sexo: Sexo[];
  public tempoHabilitacao: TempoHabilitacao[];
  public tipoResidencia: TipoResidencia[];

  // Variáveis Auxiliáres
  meuCEP: any;
  buscaVeiculo: boolean = false;
  antiFurtoSelecionado: boolean = false;
  rastreadorSelecionado: boolean = false;
  garagemSelecionado: boolean = false;
  flagVeiculoSelecionado: boolean = false;
  errorsSteps: boolean = false;
  public data: any[];
  public rowsOnPage = 5;
  modeloId: string;
  numCotacao: any;
  cobBasica: string;

  // Coleções
  public anos: Array<string> = ['2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'];
  public valoresCobertura: Array<string> = ['150.000,00', '120.000,00', '100.000,00', '80.000,00', '65.000,00', '50.000,00', '30.000,00', '15.000,00', '5.000,00', '0'];

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
    private itemService: ItemService,
    private questionarioService: QuestionarioService,
    private perfilService: PerfilService,
    private coberturaService: CoberturaService) {

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
      },
      cepPernoite: {
        required: 'Informe o CEP.',
        rangeLength: 'O CEP deve conter 8 caracteres'
      },
      flagBlindado: {
        required: 'Selecione uma resposta para o Campo "Veículo blindado?"'
      },
      flagAdaptadoDeficiente: {
        required: 'Selecione uma resposta para o Campo "Veículo adaptado para deficiente físico?"'
      },
      flagKitGas: {
        required: 'Selecione uma resposta para o Campo "Possui Kit Gás?"'
      },
      flagAlienado: {
        required: 'Selecione uma resposta para o Campo "Veículo alienado ou financiado?"'
      },
      flagAntiFurto: {
        required: 'Selecione uma resposta para o Campo "O veículo segurado possui dispositivo anti-furto, rastreador, bloqueador ou localizador instalado e ativado?"'
      },
      flagGararem: {
        required: 'Selecione uma resposta para o Campo "Existe garagem ou estacionamento fechado para o veículo?"'
      },
      relacaoSeguradoId: {
        required: 'Informe a Relação do Segurado com o Proprietário Legal do Veículo"'
      },
      flagSegPrincipalCondutor: {
        required: 'Selecione uma resposta para o Campo "Segurado é o principal condutor?"'
      },
      cpfPrincipalCondutor: {
        required: 'Informe o CPF do Principal Condutor',
        rangeLength: 'CPF do Principal Condutor deve conter 11 caracteres'
      },
      nomePrincipalCondutor: {
        required: "Informe o Nome do Principal Condutor",
        minlength: 'O Nome precisa ter no mínimo 2 caracteres',
        maxlength: 'O Nome precisa ter no máximo 150 caracteres'
      },
      dataNascPrincipalCondutor: {
        required: 'Informe a Data de Nascimento do Principal Condutor'
      },
      flagResideMenorIdade: {
        required: 'Selecione uma resposta para o Campo "O Principal Condutor reside com pessoa(s) menor(es) de 26 anos que possa(m) utilizar o veículo segurado?"'
      },
      flagPontosCarteira: {
        required: 'Selecione uma resposta para o Campo "Você possui pontos na habilitação?"'
      },
      estadoCivilId: {
        required: 'Informe o Estado civil"'
      },
      tipoResidenciaId: {
        required: 'Informe o Tipo de Residência"'
      },
      sexoId: {
        required: 'Informe o Sexo"'
      },
      tempoHabilitacaoId: {
        required: 'Informe o Tempo de Habilitação"'
      },
      distanciaTrabalhoId: {
        required: 'Informe a Distância entre a residência do Principal Condutor até seu local de trabalho"'
      },
      quantidadeVeiculoId: {
        required: 'Informe a Quantidade de veículos na Residência"'
      }
    };

    this.GenericValidator = new GenericValidator(this.validationMessages);
    this.cotacao = new Cotacao();
    this.cotacao.cliente = new Cliente();
    this.cotacao.cliente.endereco = new Endereco();
    this.cotacao.item = new Item();
    this.cotacao.questionario = new Questionario();
    this.cotacao.perfil = new Perfil();

    this.gerarNumCotacao();
  }

  ngOnInit() {
    this.cotacaoForm = this.fb.group({
      basicForm: this.fb.group({
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
        estado: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
      }),
      itemForm: this.fb.group({
        marcaId: ['', Validators.required],
        nomeModelo: ['', Validators.required],
        flagRemarcado: ['', Validators.required],
        anoFabricacao: ['', Validators.required],
        anoModelo: ['', Validators.required],
        flagZeroKm: '',
        numChassi: '',
        dataSaida: '',
        odometro: '',
        usoId: ['', Validators.required],
        impostoId: ['', Validators.required]
      }),
      questionarioForm: this.fb.group({
        cepPernoite: ['', [Validators.required, CustomValidators.rangeLength([8, 8])]],
        flagBlindado: ['', Validators.required],
        flagAdaptadoDeficiente: ['', Validators.required],
        flagKitGas: ['', Validators.required],
        flagAlienado: ['', Validators.required],
        flagAntiFurto: ['', Validators.required],
        flagGararem: ['', Validators.required],
        relacaoSeguradoId: ['', Validators.required],
        rastreadorId: '',
        antiFurtoId: '',
        gararemResidenciaId: '',
        gararemTrabalhoId: '',
        garagemFaculdadeId: '',
        propriedadeRastreadorId: ''
      }),
      perfilForm: this.fb.group({
        cpfPrincipalCondutor: ['', [Validators.required, CustomValidators.rangeLength([11, 11])]],
        nomePrincipalCondutor: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
        dataNascPrincipalCondutor: ['', Validators.required],
        flagResideMenorIdade: ['', Validators.required],
        flagSegPrincipalCondutor: ['', Validators.required],
        flagPontosCarteira: ['', Validators.required],
        estadoCivilId: ['', Validators.required],
        tipoResidenciaId: ['', Validators.required],
        sexoId: ['', Validators.required],
        tempoHabilitacaoId: ['', Validators.required],
        distanciaTrabalhoId: ['', Validators.required],
        quantidadeVeiculoId: ['', Validators.required]
      })
    });

    this.getTiposCalculo();
    this.getTiposSeguro();
    this.getPaises();
    this.getProfissoes();
    this.getUsos();
    this.getImpostos();
    this.getMarcas();
    this.getRelacaoSegurado();
    this.getEstadoCivil();
    this.getTipoResidencia();
    this.getSexo();
    this.getTempoHabilitacao();
    this.getDistanciaTrabalho();
    this.getQuantidadeVeiculos();

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
      c.dataVigenciaInicial = DateUtils.getMyDatePickerDate(c.basicForm.dataVigenciaInicial);
      c.dataVigenciaFinal = DateUtils.getMyDatePickerDate(c.basicForm.dataVigenciaFinal);

      // Cliente
      c.cliente.id = undefined;
      c.cliente.nome = c.basicForm.nome;
      c.cliente.sobreNome = c.basicForm.sobrenome;
      c.cliente.email = c.basicForm.email;
      c.cliente.cpf = c.basicForm.cpf;
      c.cliente.telefone = c.basicForm.telefone;
      c.cliente.rg = c.basicForm.rg
      c.cliente.dataNascimento = DateUtils.getMyDatePickerDate(c.basicForm.dataNascimento);
      c.cliente.profissaoId = this.selectPO.activeOption.id;
      c.cliente.paisResidenciaId = this.selectPR.activeOption.id;

      //Endereço
      c.cliente.endereco.id = undefined;
      c.cliente.endereco.logradouro = c.basicForm.logradouro;
      c.cliente.endereco.numero = c.basicForm.numero;
      c.cliente.endereco.complemento = c.basicForm.complemento;
      c.cliente.endereco.bairro = c.basicForm.bairro;
      c.cliente.endereco.cep = c.basicForm.cep;
      c.cliente.endereco.cidade = c.basicForm.cidade;
      c.cliente.endereco.estado = c.basicForm.estado;

      //Item
      c.item.id = undefined;
      c.item.numChassi = c.itemForm.numChassi;
      c.item.flagRemarcado = c.itemForm.flagRemarcado;
      c.item.dataSaida = c.itemForm.dataSaida;
      c.item.odometro = c.itemForm.odometro;
      c.item.produtoId = "1";
      c.item.modeloId = this.modeloId;
      c.item.usoId = this.selectUS.activeOption.id;
      c.item.impostoId = this.selectIM.activeOption.id;

      //Questionário
      c.questionario.id = undefined;
      c.questionario.cepPernoite = c.questionarioForm.cepPernoite;
      c.questionario.flagBlindado = c.questionarioForm.flagBlindado;
      c.questionario.flagAdaptadoDeficiente = c.questionarioForm.flagAdaptadoDeficiente;
      c.questionario.flagKitGas = c.questionarioForm.flagKitGas;
      c.questionario.flagAlienado = c.questionarioForm.flagAlienado;
      c.questionario.flagAntiFurto = c.questionarioForm.flagAntiFurto;
      c.questionario.flagGararem = c.questionarioForm.flagGararem;
      c.questionario.rastreadorId = this.selectRast != null && this.selectRast.active.length > 0 ? this.selectRast.activeOption.id : null;
      c.questionario.antiFurtoId = this.selectAnti != null && this.selectAnti.active.length > 0 ? this.selectAnti.activeOption.id : null;
      c.questionario.relacaoSeguradoId = this.selectRelSeg.activeOption.id;
      c.questionario.gararemResidenciaId = this.selectGarRes != null && this.selectGarRes.active.length > 0 ? this.selectGarRes.activeOption.id : null;
      c.questionario.gararemTrabalhoId = this.selectGarTrab != null && this.selectGarTrab.active.length > 0 ? this.selectGarTrab.activeOption.id : null;
      c.questionario.garagemFaculdadeId = this.selectGarFac != null && this.selectGarFac.active.length > 0 ? this.selectGarFac.activeOption.id : null;
      c.questionario.propriedadeRastreadorId = this.selectPropRast != null && this.selectPropRast.active.length > 0 ? this.selectPropRast.activeOption.id : null;

      //Perfil
      c.perfil.id = undefined;
      c.perfil.cpfPrincipalCondutor = c.perfilForm.cpfPrincipalCondutor;
      c.perfil.nomePrincipalCondutor = c.perfilForm.nomePrincipalCondutor;
      c.perfil.dataNascPrincipalCondutor = DateUtils.getMyDatePickerDate(c.perfilForm.dataNascPrincipalCondutor);
      c.perfil.flagResideMenorIdade = c.perfilForm.flagResideMenorIdade;
      c.perfil.flagSegPrincipalCondutor = c.perfilForm.flagSegPrincipalCondutor;
      c.perfil.flagPontosCarteira = c.perfilForm.flagPontosCarteira;
      c.perfil.estadoCivilId = this.selectEstCiv.activeOption.id;
      c.perfil.tipoResidenciaId = this.selectTipRes.activeOption.id;
      c.perfil.sexoId = this.selectSex.activeOption.id;
      c.perfil.tempoHabilitacaoId = this.selectTempHab.activeOption.id;
      c.perfil.distanciaTrabalhoId = this.selectDistTrab.activeOption.id;
      c.perfil.quantidadeVeiculoId = this.selectQtdVeic.activeOption.id;

      //Coberturas
      c.item.listCoberturasItem = this.montarCoberturas(this.listCoberturas);

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

  gerarNumCotacao(): void {
    this.cotacaoService.gerarNumCotacaoRandomico()
      .subscribe(
      apiData => {
        this.numCotacao = apiData;
      },
      error => this.errors
      );
  }

  getRelacaoSegurado(): void {
    this.questionarioService.obterRelacaoSegurados()
      .subscribe(
      api => {
        this.relacaoSegurado = api;
        this.relacaoSegurado.forEach(item => {
          item.relacaoSeguradoId = item.relacaoSeguradoId.toString();
          this.selectRelSeg.itemObjects.push(new SelectItem({ id: item.relacaoSeguradoId, text: item.descricao }))
        });
      },
      error => this.errors
      );
  }

  getRastreadores(): void {
    this.questionarioService.obterRastreadores()
      .subscribe(
      api => {
        this.rastreadores = api;
        this.rastreadores.forEach(item => {
          item.rastreadorId = item.rastreadorId.toString();
          this.selectRast.itemObjects.push(new SelectItem({ id: item.rastreadorId, text: item.nome }))
        });
      },
      error => this.errors
      );
  }

  getAntiFurtos(): void {
    this.questionarioService.obterAntiFurtos()
      .subscribe(
      api => {
        this.antifurtos = api;
        this.antifurtos.forEach(item => {
          item.antiFurtoId = item.antiFurtoId.toString();
          this.selectAnti.itemObjects.push(new SelectItem({ id: item.antiFurtoId, text: item.nome }))
        });
      },
      error => this.errors
      );
  }

  getPropRastreadores(): void {
    this.questionarioService.obterPropriedadeRastreadors()
      .subscribe(
      api => {
        this.propriedadeRastreadores = api;
        this.propriedadeRastreadores.forEach(item => {
          item.propriedadeRastreadorId = item.propriedadeRastreadorId.toString();
          this.selectPropRast.itemObjects.push(new SelectItem({ id: item.propriedadeRastreadorId, text: item.descricao }))
        });
      },
      error => this.errors
      );
  }

  getGarFaculdade(): void {
    this.questionarioService.obterGaragemFaculdades()
      .subscribe(
      api => {
        this.garagemFaculdade = api;
        this.garagemFaculdade.forEach(item => {
          item.garagemFaculdadeId = item.garagemFaculdadeId.toString();
          this.selectGarFac.itemObjects.push(new SelectItem({ id: item.garagemFaculdadeId, text: item.descricao }))
        });
      },
      error => this.errors
      );
  }

  getGarTrabalho(): void {
    this.questionarioService.obterGararemTrabalhos()
      .subscribe(
      api => {
        this.garagemTrabalho = api;
        this.garagemTrabalho.forEach(item => {
          item.garagemTrabalhoId = item.garagemTrabalhoId.toString();
          this.selectGarTrab.itemObjects.push(new SelectItem({ id: item.garagemTrabalhoId, text: item.descricao }))
        });
      },
      error => this.errors
      );
  }

  getGarResidencia(): void {
    this.questionarioService.obterGararemResidencias()
      .subscribe(
      api => {
        this.garagemResidencia = api;
        this.garagemResidencia.forEach(item => {
          item.garagemResidenciaId = item.garagemResidenciaId.toString();
          this.selectGarRes.itemObjects.push(new SelectItem({ id: item.garagemResidenciaId, text: item.descricao }))
        });
      },
      error => this.errors
      );
  }

  getEstadoCivil(): void {
    this.perfilService.ObterEstadoCivis()
      .subscribe(
      api => {
        this.estadoCivil = api;
        this.estadoCivil.forEach(item => {
          item.estadoCivilId = item.estadoCivilId.toString();
          this.selectEstCiv.itemObjects.push(new SelectItem({ id: item.estadoCivilId, text: item.descricao }))
        });
      },
      error => this.errors
      );
  }

  getTipoResidencia(): void {
    this.perfilService.ObterTipoResidencia()
      .subscribe(
      api => {
        this.tipoResidencia = api;
        this.tipoResidencia.forEach(item => {
          item.tipoResidenciaId = item.tipoResidenciaId.toString();
          this.selectTipRes.itemObjects.push(new SelectItem({ id: item.tipoResidenciaId, text: item.descricao }))
        });
      },
      error => this.errors
      );
  }

  getSexo(): void {
    this.perfilService.ObterSexos()
      .subscribe(
      api => {
        this.sexo = api;
        this.sexo.forEach(item => {
          item.sexoId = item.sexoId.toString();
          this.selectSex.itemObjects.push(new SelectItem({ id: item.sexoId, text: item.descricao }))
        });
      },
      error => this.errors
      );
  }

  getTempoHabilitacao(): void {
    this.perfilService.ObterTempoHabilitacao()
      .subscribe(
      api => {
        this.tempoHabilitacao = api;
        this.tempoHabilitacao.forEach(item => {
          item.tempoHabilitacaoId = item.tempoHabilitacaoId.toString();
          this.selectTempHab.itemObjects.push(new SelectItem({ id: item.tempoHabilitacaoId, text: item.descricao }))
        });
      },
      error => this.errors
      );
  }

  getDistanciaTrabalho(): void {
    this.perfilService.ObterDistancias()
      .subscribe(
      api => {
        this.distanciaTrabalho = api;
        this.distanciaTrabalho.forEach(item => {
          item.distanciaTrabalhoId = item.distanciaTrabalhoId.toString();
          this.selectDistTrab.itemObjects.push(new SelectItem({ id: item.distanciaTrabalhoId, text: item.descricao }))
        });
      },
      error => this.errors
      );
  }

  getQuantidadeVeiculos(): void {
    this.perfilService.ObterQuantidadeVeiculos()
      .subscribe(
      api => {
        this.quantidadeVeiculos = api;
        this.quantidadeVeiculos.forEach(item => {
          item.quantidadeVeiculoId = item.quantidadeVeiculoId.toString();
          this.selectQtdVeic.itemObjects.push(new SelectItem({ id: item.quantidadeVeiculoId, text: item.descricao }))
        });
      },
      error => this.errors
      );
  }

  onBlurCEP() {
    let validaCEP = /^[0-9]{8}$/;
    let cep = UnMasked.clearMaskControls(this.meuCEP.toString());

    if (validaCEP.test(cep)) {
      //this.cotacaoForm.controls['logradouro'].setValue("...");
      this.cotacaoForm.patchValue({ basicForm: { logradouro: '...' } });
      this.cotacaoForm.patchValue({ basicForm: { bairro: '...' } });
      this.cotacaoForm.patchValue({ basicForm: { cidade: '...' } });
      this.cotacaoForm.patchValue({ basicForm: { estado: '...' } });

      this.clienteService.obterCEP(cep)
        .subscribe(
        result => {
          if (result.erro) {
            alert("CEP não encontrado!");
            this.clearControls();
          } else {
            this.cotacaoForm.get('basicForm.complemento').enable();
            this.cotacaoForm.get('basicForm.numero').enable();
            this.cotacaoForm.patchValue({ basicForm: { logradouro: result.logradouro } });
            this.cotacaoForm.patchValue({ basicForm: { bairro: result.bairro } });
            this.cotacaoForm.patchValue({ basicForm: { cidade: result.localidade } });
            this.cotacaoForm.patchValue({ basicForm: { estado: result.uf } });
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
    this.cotacaoForm.get('basicForm.complemento').disable();
    this.cotacaoForm.get('basicForm.numero').disable();
    this.cotacaoForm.patchValue({ basicForm: { complemento: '' } });
    this.cotacaoForm.patchValue({ basicForm: { numero: '' } });
    this.cotacaoForm.patchValue({ basicForm: { logradouro: '' } });
    this.cotacaoForm.patchValue({ basicForm: { bairro: '' } });
    this.cotacaoForm.patchValue({ basicForm: { cidade: '' } });
    this.cotacaoForm.patchValue({ basicForm: { estado: '' } });
  }

  onDisableDates() {
    //this.cotacaoForm.controls['dataVigenciaInicial'].disabled;
    this.cotacaoForm.get('basicForm.dataVigenciaInicial').disabled;
    this.cotacaoForm.get('basicForm.dataVigenciaFinal').disabled;
  }

  changeSourceTC($event): void {
    let dateNow = DateUtils.convertUTCDateToLocalDate(new Date());
    //this.cotacaoForm.controls['dataVigenciaInicial'].setValue(DateUtils.setMyDatePickerDate(dateNow));
    this.cotacaoForm.patchValue({ basicForm: { dataVigenciaInicial: DateUtils.setMyDatePickerDate(dateNow) } });

    if ($event == 1) {
      this.cotacaoForm.patchValue({ basicForm: { dataVigenciaFinal: DateUtils.setMyDatePickerOneYear(dateNow) } });
      this.onDisableDates();
    }
    else if ($event == 2) {
      this.cotacaoForm.patchValue({ basicForm: { dataVigenciaFinal: DateUtils.setMyDatePickerTwoYear(dateNow) } });
      this.onDisableDates();
    }
    else {
      this.cotacaoForm.get('basicForm.dataVigenciaFinal').enabled;
      this.cotacaoForm.patchValue({ basicForm: { dataVigenciaFinal: '' } });
    }
  }

  removeSourceTC($event) {
    this.onDisableDates();
    this.cotacaoForm.patchValue({ basicForm: { dataVigenciaInicial: '' } });
    this.cotacaoForm.patchValue({ basicForm: { dataVigenciaFinal: '' } });
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
    //this.cotacaoForm.controls['nomeModelo'].setValue('');
    this.cotacaoForm.patchValue({ itemForm: { nomeModelo: '' } });
    this.itemService.obterNomeModelosMarcas(this.selectMA.activeOption.id)
      .subscribe(data => this.listModelos = data);
  }

  removeSourceMarca($event): void {
    this.listModelos = [];
    this.cotacaoForm.patchValue({ itemForm: { nomeModelo: '' } });
  }

  zeroKmChanged($event): void {
    this.cotacaoForm.patchValue({ itemForm: { dataSaida: '' } });
    this.cotacaoForm.patchValue({ itemForm: { odometro: '' } });
  }

  buscarVeiculos($event): void {
    this.errorsVeic = [];
    //let nomeVeic = this.cotacaoForm.controls['nomeModelo'].value;
    let nomeVeic = this.cotacaoForm.get('itemForm.nomeModelo').value;
    let anoFab = this.selectAnoFab.active.length > 0 ? this.selectAnoFab.activeOption.id : "";
    let anoMod = this.selectAnoMod.active.length > 0 ? this.selectAnoMod.activeOption.id : "";
    //let zeroKm = this.cotacaoForm.controls['flagZeroKm'].value == true ? "1" : "0";
    let zeroKm = this.cotacaoForm.get('itemForm.flagZeroKm').value == true ? "1" : "0";

    if (nomeVeic !== null && anoFab !== "" && anoMod !== "") {
      this.buscaVeiculo = true;
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
    //this.cotacaoForm.controls['flagRemarcado'].setValue('false');
    this.cotacaoForm.patchValue({ itemForm: { flagRemarcado: 'false' } });
    this.cotacaoForm.patchValue({ questionarioForm: { flagBlindado: 'false' } });
    this.cotacaoForm.patchValue({ questionarioForm: { flagAdaptadoDeficiente: 'false' } });
    this.cotacaoForm.patchValue({ questionarioForm: { flagKitGas: 'false' } });
    this.cotacaoForm.patchValue({ questionarioForm: { flagAlienado: 'false' } });
    this.cotacaoForm.patchValue({ questionarioForm: { flagAntiFurto: 'false' } });
    this.cotacaoForm.patchValue({ questionarioForm: { flagGararem: 'false' } });
    this.cotacaoForm.patchValue({ perfilForm: { flagResideMenorIdade: 'false' } });
    this.cotacaoForm.patchValue({ perfilForm: { flagSegPrincipalCondutor: 'false' } });
    this.cotacaoForm.patchValue({ perfilForm: { flagPontosCarteira: 'false' } });
  }

  verificarAntiFurto(state): void {
    if (state == true) {
      this.antiFurtoSelecionado = true;
      this.getRastreadores();
      this.getAntiFurtos();
    }
    else {
      this.selectRast.itemObjects = [];
      this.selectAnti.itemObjects = [];
      if (this.selectRast.active.length) this.selectRast.remove(this.selectRast.activeOption)
      if (this.selectAnti.active.length) this.selectAnti.remove(this.selectAnti.activeOption)

      this.antiFurtoSelecionado = false;
    }
  }

  changeRastreador(id): void {
    if (!this.rastreadorSelecionado)
      this.getPropRastreadores();

    if (id != 0)
      this.rastreadorSelecionado = true;
    else
      this.rastreadorSelecionado = false;
  }

  removeRastreador(): void {
    this.rastreadorSelecionado = false;
    this.selectPropRast.itemObjects = [];
    this.selectPropRast.remove(this.selectPropRast.activeOption)
  }

  verificarGaragem(state): void {
    if (state == true) {
      this.garagemSelecionado = true;
      this.getGarFaculdade();
      this.getGarTrabalho();
      this.getGarResidencia();
    }
    else {
      this.selectGarFac.remove(this.selectGarFac.activeOption)
      this.selectGarFac.itemObjects = [];
      this.selectGarTrab.remove(this.selectGarTrab.activeOption)
      this.selectGarTrab.itemObjects = [];
      this.selectGarRes.remove(this.selectGarRes.activeOption)
      this.selectGarRes.itemObjects = [];

      this.garagemSelecionado = false;
    }
  }

  verificarPrinCondutor(state): void {
    if (state == true) {
      this.cotacaoForm.patchValue({ perfilForm: { cpfPrincipalCondutor: this.cotacaoForm.get('basicForm.cpf').value } });
      this.cotacaoForm.patchValue({ perfilForm: { nomePrincipalCondutor: this.cotacaoForm.get('basicForm.nome').value } });
      this.cotacaoForm.patchValue({ perfilForm: { dataNascPrincipalCondutor: this.cotacaoForm.get('basicForm.dataNascimento').value } });
      //this.cotacaoForm.controls['cpfPrincipalCondutor'].setValue(this.cotacaoForm.controls['cpf'].value);
    }
    else {
      this.cotacaoForm.patchValue({ perfilForm: { cpfPrincipalCondutor: '' } });
      this.cotacaoForm.patchValue({ perfilForm: { nomePrincipalCondutor: '' } });
      this.cotacaoForm.patchValue({ perfilForm: { dataNascPrincipalCondutor: '' } });
    }
  }

  validarQuestionarioStep(): boolean {
    if (!(<FormGroup>this.cotacaoForm.get('questionarioForm')).valid)
      return false;
    else
      return true;
  }

  validarPerfilStep(): boolean {
    if (!(<FormGroup>this.cotacaoForm.get('perfilForm')).valid)
      return false;
    else
      return true;
  }

  validarItemStep(): boolean {
    if (!(<FormGroup>this.cotacaoForm.get('itemForm')).valid)
      return false;
    else
      return true;
  }

  validarBasicStep(): boolean {
    if (!(<FormGroup>this.cotacaoForm.get('basicForm')).valid)
      return false;
    else
      return true;
  }

  verificarStep(formStep, event): void {
    UnMasked.unMaskFormComponents(<FormGroup>this.cotacaoForm.get(formStep));
    this.displayMessage = this.GenericValidator.processAllMessages(<FormGroup>this.cotacaoForm.get(formStep));

    if (!(<FormGroup>this.cotacaoForm.get(formStep)).valid)
      this.errorsSteps = true;
    else
      this.errorsSteps = false;
  }

  initCoberturaStep(event): void {
    this.coberturaService.obterCoberturas("1")
      .subscribe(
      apiCoberturas => {
        this.listCoberturas = apiCoberturas;
      },
      error => this.errors
      );

    this.verificarFlagBasica();
  }

  verificarFlagBasica(): void {
    this.coberturaService.verificarFlagBasica("1")
      .subscribe(
      apiCoberturas => {
        this.cobBasica = apiCoberturas;
      },
      error => this.errors
      );
  }

  closeErroSummary(event): void {
    this.errors = [];
    this.errorsSteps = false;
  }

  montarCoberturas(listCoberturas): any {
    var objCoberturas = [];

    listCoberturas.forEach(cob => {
      var cobertura = {};
      cobertura["Id"] = undefined;
      cobertura["CoberturaId"] = cob.coberturaId;

      if (this.cobBasica === cob.coberturaId) {
        cobertura["Valor"] = parseFloat(this.elemCob.nativeElement.id);
      } else {
        var elemento = this.listSelectValCoberturas.find(item => item.Id === cob.coberturaId);
        if (typeof elemento !== "undefined")
          cobertura["Valor"] = parseFloat(elemento.Valor.replace(".", ""));
        else
          cobertura["Valor"] = 0;
      }
      objCoberturas.push(cobertura);
    })
    return objCoberturas;
  }

  selectedCobertura($event, cobId): void {
    var achou = this.listSelectValCoberturas.find(item => item.Id === cobId)

    if (typeof achou !== "undefined") {
      this.listSelectValCoberturas = this.listSelectValCoberturas.filter(item => item.Id !== cobId);
    } else {
      var arrayCob = {};
      arrayCob["Id"] = cobId;
      arrayCob["Valor"] = $event.id;

      this.listSelectValCoberturas.push(arrayCob);
    }
  }

  removedCoberturas($event, cobId): void {
    this.listSelectValCoberturas = this.listSelectValCoberturas.filter(item => item.Id !== cobId);
  }
}
