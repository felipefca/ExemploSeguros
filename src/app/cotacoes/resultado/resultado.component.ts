import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { CotacaoService } from "app/cotacoes/services/cotacao.services";
import { ItemService } from "app/cotacoes/services/item.services";

import { Cotacao } from "app/cotacoes/models/cotacao";
import { Modelo } from "app/cotacoes/models/modelo";

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoComponent implements OnInit {

  cotacaoId: string = "";
  numCotacao: string = "";
  private sub: any;
  private modeloId: string;
  public cotacao: Cotacao;
  public modelos: Modelo[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private cotacaoService: CotacaoService,
    private itemService: ItemService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(
      params => {
        this.cotacaoId = params['id'];
        this.numCotacao = params['numCotacao'];
        this.obterCotacao(this.cotacaoId);
      }
    );
  }

  obterCotacao(id: string) {
    this.cotacaoService.obterCotacao(id)
      .subscribe(
      cotacao => this.preencherFormCotacao(cotacao),
      response => {
        if (response.status == 404) {
          this.router.navigate(['NotFound']);
        }
      });
  }

  obterDadosModelo(modeloId: string): void {
    this.itemService.obterDadosModeloSelecionado(modeloId)
      .subscribe(
      data => this.modelos = data,
      response => {
        if (response.status == 404) {
          this.router.navigate(['NotFound']);
        }
      });
  }

  preencherFormCotacao(cotacao: Cotacao): void {
    this.cotacao = cotacao;
    this.modeloId = cotacao.item.modeloId;

    this.obterDadosModelo(this.modeloId);
  };
}
