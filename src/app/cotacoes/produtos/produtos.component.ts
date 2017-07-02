import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {

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