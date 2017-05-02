import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.component.html',
  styleUrls: ['./lista-produtos.component.css']
})
export class ListaProdutosComponent implements OnInit {

  idAttr: string;

  constructor() {
    this.idAttr = "";
  }

  ngOnInit() {
  }

  eventoSelecaoProduto(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    this.idAttr = target.attributes.id.value;
  }

  produtoSelecionado(): string {
    return this.idAttr;
  }
}
