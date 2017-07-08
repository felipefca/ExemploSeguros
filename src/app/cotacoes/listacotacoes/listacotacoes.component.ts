import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { CotacaoService } from "app/cotacoes/services/cotacao.services";
import { ItemService } from "app/cotacoes/services/item.services";

import { Cotacao } from "app/cotacoes/models/cotacao";
import { Modelo } from "app/cotacoes/models/modelo";

@Component({
  selector: 'app-listacotacoes',
  templateUrl: './listacotacoes.component.html',
  styleUrls: ['./listacotacoes.component.css']
})
export class ListacotacoesComponent implements OnInit {

  @ViewChild("elemModelo", { read: ElementRef }) elemMod: ElementRef;

  public cotacoes: Cotacao[];
  public modelos: Modelo[];
  public errorMessage: string = "";
  private modeloId: string;

  constructor(private cotacaoService: CotacaoService,
    private itemService: ItemService) { }

  ngOnInit() {
    let userId = this.cotacaoService.obterUsuario();

    this.cotacaoService.obterCotacoesUsuario(userId["id"])
      .subscribe(
      data => this.preencherCampos(data),
      error => this.errorMessage
      );
  }

  preencherCampos(cotacoes: Cotacao[]): void {
    if (cotacoes.length == 0) {
      this.cotacoes = [];
    } else {
      this.cotacoes = cotacoes;

      this.cotacoes.forEach(cot => {
        this.obterDadosModelo(cot.item.modeloId);
      })
    }
  };

  obterDadosModelo(modeloId: string): void {
    this.itemService.obterDadosModeloSelecionado(modeloId)
      .subscribe(
      data => this.modelos = data,
      error => this.errorMessage
      );
  }

  selecionarItem($event, $id): void {

  }

  removerItem($event, $id): void {

  }
}
