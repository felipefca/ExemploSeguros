import { Component, OnInit } from '@angular/core';

import { CotacaoService } from "app/cotacoes/services/cotacao.services";

import { Cotacao } from "app/cotacoes/models/cotacao";
import { Modelo } from "app/cotacoes/models/modelo";

@Component({
  selector: 'app-listacotacoes',
  templateUrl: './listacotacoes.component.html',
  styleUrls: ['./listacotacoes.component.css']
})
export class ListacotacoesComponent implements OnInit {

  public cotacoes: Cotacao[];
  public errorMessage: string = "";

  constructor(private cotacaoService: CotacaoService) { }

  ngOnInit() {
    let userId = this.cotacaoService.obterUsuario();

    this.cotacaoService.obterCotacoesUsuario(userId["id"])
      .subscribe(
      data => this.preencherCampos(data),
      error => this.errorMessage
      );
  }

  preencherCampos(cotacoes: Cotacao[]): void {
    this.cotacoes = cotacoes;
  };
}
